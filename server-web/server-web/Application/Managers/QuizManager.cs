using Microsoft.EntityFrameworkCore;
using server_web.Application.ExternalServices.Quiz;
using server_web.Data.Repository.IRepository;
using server_web.Model;
using server_web.Model.Dto;
using System.Text.Json;

namespace server_web.Application.Managers
{
    public class QuizManager : IQuizManager
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IQuizService _quizService;

        public QuizManager(IUnitOfWork unitOfWork, IQuizService quizService)
        {
            _unitOfWork = unitOfWork;
            _quizService = quizService;
        }
        public async Task<IEnumerable<Quiz>> GetQuizzesAsync(string? userId)
        {
            return await _unitOfWork.Quiz
                .GetAllAsync(q => q.UserId == userId);
        }
        public async Task<QuizDto?> GetQuizAsync(Guid id)
        {
            var quiz = await _unitOfWork.Quiz.GetQuizWithQuestions(id);
            if (quiz == null)
                throw new KeyNotFoundException("Quiz not found");
            return new QuizDto(quiz);
        }
        public async Task<Quiz> CreateQuizAsync(string topic, string userId)
        {
            var generated_quiz = await _quizService.GenerateQuizAsync(topic);

            var quiz = new Quiz
            {
                Title = generated_quiz.Title,
                Description = generated_quiz.Description,
                UserId = userId,
            };

            await _unitOfWork.Quiz.AddAsync(quiz);

            foreach (var q in generated_quiz.Questions)
            {
                var question = new Question
                {
                    QuizId = quiz.Id,
                    OptionsJson = JsonSerializer.Serialize(q.Options),
                    Text = q.Text,
                    CorrectAnswerIndex = q.CorrectAnswerIndex,
                    Order = q.Order,
                };
                await _unitOfWork.Question.AddAsync(question);
            }

            await _unitOfWork.SaveAsync();
            return quiz;
        }
        public async Task<Quiz?> DeleteQuizAsync(Guid id, string userId)
        {
            var quiz = await _unitOfWork.Quiz.GetFirstOrDefaultAsync(q => q.Id == id && q.UserId == userId);
            if (quiz == null)
            {
                throw new KeyNotFoundException("Quiz not found");
            }
            _unitOfWork.Quiz.Remove(quiz);
            await _unitOfWork.SaveAsync();
            return quiz;
        }
    }
}
