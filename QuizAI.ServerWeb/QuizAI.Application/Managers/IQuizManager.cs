using QuizAI.Model;
using QuizAI.Model.Dto;

namespace QuizAI.Application.Managers
{
    public interface IQuizManager
    {
        public Task<IEnumerable<Quiz>> GetQuizzesAsync(string? userId);
        public Task<QuizDto?> GetQuizAsync(Guid id);
        public Task<Quiz> CreateQuizAsync(string topic, string userId);
        public Task<Quiz?> DeleteQuizAsync(Guid id, string userId);
    }
}
