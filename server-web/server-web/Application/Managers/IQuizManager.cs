using server_web.Model;
using server_web.Model.Dto;

namespace server_web.Application.Managers
{
    public interface IQuizManager
    {
        public IEnumerable<Quiz> GetQuizzes(string? userId = null);
        public QuizDto? GetQuiz(Guid id);
        public Task<Quiz> CreateQuiz(string topic, string userId);
        public Quiz? DeleteQuiz(Guid id, string userId);
    }
}
