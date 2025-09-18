using Microsoft.EntityFrameworkCore;
using server_web.Data.Repository.IRepository;
using server_web.Model;
using server_web.Model.Dto;
using System.Text.Json;

namespace server_web.Application.Managers
{
    public class QuizAttemptManager : IQuizAttemptManager
    {
        private readonly IUnitOfWork _unitOfWork;
        public QuizAttemptManager(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<QuizAttemptResultDto> SubmitQuizAnswersAsync(SubmitQuizAnswersDto dto, string userId)
        {
            var quiz = await _unitOfWork.Quiz.GetQuizWithQuestions(dto.QuizId);
            
            if (quiz == null)
                throw new KeyNotFoundException($"Quiz with ID {dto.QuizId} not found");
            
            var existingQuestions = quiz.Questions.Select(q => q.Order).ToList(); 
            if (existingQuestions.Count != dto.Answers.Count)
            {
                throw new ArgumentException("Some questions were not found or invalid");
            }
            
            var attempt = new QuizAttempt
            {
                QuizId = dto.QuizId,
                UserId = userId,
                CompletedAt = DateTime.UtcNow
            };

            await _unitOfWork.QuizAttempt.AddAsync(attempt);

            var userAnswer = new List<UserAnswer>();
            int score = 0;

            foreach (var answer in dto.Answers)
            {
                var question = quiz.Questions.FirstOrDefault(q =>
                    q.QuizId == answer.QuestionQuizId &&
                    q.Order == answer.QuestionOrder);

                if (question == null)
                    throw new ArgumentException($"Question with order {answer.QuestionOrder} not found");

                var ua = new UserAnswer
                {
                    QuizAttemptId = attempt.Id,
                    QuestionQuizId = answer.QuestionQuizId,
                    QuestionOrder = answer.QuestionOrder,
                    SelectedAnswerIndex = answer.SelectedAnswerIndex
                };

                if (ua.SelectedAnswerIndex == question.CorrectAnswerIndex)
                    score++;

                userAnswer.Add(ua);
            }

            await _unitOfWork.SaveAsync();

            var totalQuestions = dto.Answers.Count;
            var percentage = totalQuestions > 0 ? Math.Round((decimal)score / totalQuestions * 100, 2) : 0;

            attempt.Score = score;
            attempt.Percentage = percentage;

            await _unitOfWork.SaveAsync();

            return new QuizAttemptResultDto
            {
                Id = attempt.Id,
                QuizId = dto.QuizId,
                Score = score,
                Percentage = percentage,
                TotalQuestions = existingQuestions.Count(),
                CompletedAt = DateTime.UtcNow,
            };
        }
        public async Task<QuizLeaderboardDto> GetQuizLeaderboardAsync(string userId, Guid quizId, int limit)
        {
            var quiz = await _unitOfWork.Quiz.GetFirstOrDefaultAsync(q => q.Id == quizId);

            if (quiz == null)
                throw new KeyNotFoundException($"Quiz with ID {quizId} not found");

            var groupedAttempts = await _unitOfWork.QuizAttempt
                .GetAllAsync(qa => qa.QuizId == quizId && qa.Score.HasValue, "User");

            var bestAttempts = groupedAttempts
                .GroupBy(a => a.UserId)
                .Select(g => g.OrderByDescending(a => a.Score).ThenBy(a => a.CompletedAt).First())
                .OrderByDescending(a => a.Score)
                .ThenBy(a => a.CompletedAt)
                .Take(limit);

            var leaderboardEntries = bestAttempts.Select((a, index) => new LeaderboardEntryDto
            {
                Position = index + 1,
                UserName = a.User.UserName ?? "Unknown",
                Score = a.Score ?? 0,
                Percentage = a.Percentage ?? 0,
                CompletedAt = a.CompletedAt ?? DateTime.MinValue,
                IsCurrentUser = a.UserId == userId
            });

            return new QuizLeaderboardDto
            {
                QuizId = quizId,
                Entries = leaderboardEntries.ToList()
            };
        }
        public async Task<IEnumerable<QuizAttemptResultDto>> GetUserAttemptsAsync(Guid quizId, string userId)
        {
            var attempts = await _unitOfWork.QuizAttempt
                .GetAllAsync(qa => qa.QuizId == quizId && qa.UserId == userId, "Quiz");
            var orderedDto = attempts
                .OrderByDescending(a => a.CompletedAt)
                .Select(a => new QuizAttemptResultDto
                {
                    Id = a.Id,
                    QuizId = a.QuizId,
                    Score = a.Score ?? 0,
                    CompletedAt = a.CompletedAt ?? DateTime.MinValue,
                    Percentage = a.Percentage ?? 0,
                    TotalQuestions = a.Quiz.Questions.Count,
                })
                .ToList();
            return orderedDto;
        }
        public async Task<QuizAttemptReviewDto> GetQuizAttemptReviewAsync(Guid attemptId, string userId)
        {
            var attempt = await _unitOfWork.QuizAttempt
                .GetFirstOrDefaultAsync(qa => qa.Id == attemptId && qa.UserId == userId, "UserAnswers");
            var quiz = await _unitOfWork.Quiz.GetQuizWithQuestions(attempt!.QuizId);
            if (attempt == null)
                throw new KeyNotFoundException($"Attempt with ID {attemptId} not found");
            var questions = attempt.UserAnswers
                .OrderBy(ua => ua.QuestionOrder)
                .Select(ua => new QuestionReviewDto
                {
                    QuestionQuizId = ua.QuestionQuizId,
                    QuestionOrder = ua.QuestionOrder,
                    QuestionText = quiz.Questions.Where(q => q.Order == ua.QuestionOrder).Select(q => q.Text).First(),
                    Options = quiz.Questions.Where(q => q.Order == ua.QuestionOrder).Select(q => q.Options).First(),
                    SelectedAnswerIndex = ua.SelectedAnswerIndex,
                    CorrectAnswerIndex = quiz.Questions.Where(q => q.Order == ua.QuestionOrder).Select(q => q.CorrectAnswerIndex).First(),
                    IsCorrect =ua.IsCorrect,
                })
                .ToList();
            return new QuizAttemptReviewDto
            {
                Id = attempt.Id,
                QuizId = attempt.QuizId,
                CompletedAt = attempt.CompletedAt ?? DateTime.MinValue,
                Score = attempt.Score ?? 0,
                Percentage = attempt.Percentage ?? 0,
                TotalQuestions = questions.Count,
                Questions = questions
            };
        }
        public async Task<IEnumerable<Quiz>> GetAllAttemptedQuiz(string userId)
        {
            var quizzes = await _unitOfWork.QuizAttempt.GetAllAsync(qa => qa.UserId == userId, "Quiz");
            return quizzes
                .Select(q => q.Quiz);
        }
    }
}
