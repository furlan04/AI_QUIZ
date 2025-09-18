using server_web.Model;
using server_web.Model.Dto;

namespace server_web.Application.Managers
{
    public interface IQuizManager
    {
        public Task<IEnumerable<Quiz>> GetQuizzesAsync(string? userId);
        public Task<QuizDto?> GetQuizAsync(Guid id);
        public Task<Quiz> CreateQuizAsync(string topic, string userId);
        public Task<Quiz?> DeleteQuizAsync(Guid id, string userId);
    }
}
