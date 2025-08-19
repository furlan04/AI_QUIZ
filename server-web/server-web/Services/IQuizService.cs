using server_web.Model;

namespace server_web.Services
{
    public interface IQuizService
    {
        Task<GeneratedQuiz> GenerateQuizAsync(string topic);
    }
}
