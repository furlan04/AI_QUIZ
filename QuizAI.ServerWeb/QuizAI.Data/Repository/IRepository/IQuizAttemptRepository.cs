using QuizAI.Model;

namespace QuizAI.Data.Repository.IRepository
{
    public interface IQuizAttemptRepository : IRepository<QuizAttempt>
    {
        void Update(QuizAttempt entity);
    }
}
