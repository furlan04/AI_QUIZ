using QuizAI.Model;
using QuizAI.Model.Dto;

namespace QuizAI.Application.Managers
{
    public interface IQuizAttemptManager
    {
        Task<QuizAttemptResultDto> SubmitQuizAnswersAsync(SubmitQuizAnswersDto dto, string userId);
        Task<QuizLeaderboardDto> GetQuizLeaderboardAsync(string userId, Guid quizId, int limit);
        Task<IEnumerable<QuizAttemptResultDto>> GetUserAttemptsAsync(Guid quizId, string userId);
        Task<QuizAttemptReviewDto> GetQuizAttemptReviewAsync(Guid attemptId, string userId);
        Task<IEnumerable<Quiz>> GetAllAttemptedQuiz(string userId);
    }
}
