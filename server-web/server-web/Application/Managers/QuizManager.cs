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
        public IEnumerable<Quiz> GetQuizzes(string userId)
        {
            return _unitOfWork.Quiz
                .GetAll()
                .Where(q => q.UserId == userId)
                .ToList();
        }
        public QuizDto GetQuiz(Guid id)
        {
            var quiz = _unitOfWork.Quiz.GetQuizWithQuestions(id);
            return new QuizDto(quiz);
        }
        public async Task<Quiz> CreateQuiz(string topic, string userId)
        {
            var generated_quiz = await _quizService.GenerateQuizAsync(topic);

            var quiz = new Quiz
            {
                Title = generated_quiz.Title,
                Description = generated_quiz.Description,
                UserId = userId,
            };

            _unitOfWork.Quiz.Add(quiz);

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
                _unitOfWork.Question.Add(question);
            }

            _unitOfWork.Save();
            return quiz;
        }
        public Quiz? DeleteQuiz(Guid id, string userId)
        {
            var quiz = _unitOfWork.Quiz.GetFirstOrDefault(q => q.Id == id && q.UserId == userId);
            if (quiz == null)
            {
                throw new KeyNotFoundException("Quiz not found");
            }
            _unitOfWork.Quiz.Remove(quiz);
            _unitOfWork.Save();
            return quiz;
        }
    }
}
