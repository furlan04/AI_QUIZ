using server_web.Model;

namespace server_web.Services
{
    public interface IQuizService
    {
        Task<Quiz> GenerateQuizAsync(string topic);
    }
}
