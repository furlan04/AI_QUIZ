using server_web.Model;

namespace server_web.Application.Managers
{
    public interface IQuizManager
    {
        public IEnumerable<Quiz> GetQuizzes(string? userId = null);
        public Quiz? GetQuiz(Guid id);
        public Task<Quiz> CreateQuiz(string topic, string userId);
        public Quiz? DeleteQuiz(Guid id, string userId);
    }
}
