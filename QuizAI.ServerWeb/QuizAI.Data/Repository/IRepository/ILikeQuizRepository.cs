using QuizAI.Model;

namespace QuizAI.Data.Repository.IRepository
{
    public interface ILikeQuizRepository : IRepository<LikeQuiz>
    {
        void Update(LikeQuiz entity);
    }
}
