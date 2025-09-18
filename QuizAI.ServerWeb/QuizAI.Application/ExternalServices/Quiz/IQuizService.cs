using QuizAI.Model;

namespace QuizAI.Application.ExternalServices.Quiz
{
    public interface IQuizService
    {
        Task<GeneratedQuiz> GenerateQuizAsync(string topic);
    }
}
