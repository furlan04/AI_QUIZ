using QuizAI.Model;
using QuizAI.Model.Dto;

namespace QuizAI.Application.Managers
{
    public interface ILikeManager
    {
        Task<LikedDto> IsQuizLikedAsync(Guid quizId, string userId);
        Task<LikeQuiz> LikeQuizAsync(Guid quizId, string userId);
        Task UnlikeQuizAsync(Guid quizId, string userId);
        Task<IEnumerable<Quiz>> GetLikedQuizzesAsync(string userId);
    }
}
