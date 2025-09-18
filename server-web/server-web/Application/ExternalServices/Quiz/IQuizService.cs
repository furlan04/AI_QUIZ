using server_web.Model;

namespace server_web.Application.ExternalServices.Quiz
{
    public interface IQuizService
    {
        Task<GeneratedQuiz> GenerateQuizAsync(string topic);
    }
}
