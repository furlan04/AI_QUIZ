using server_web.Model;

namespace server_web.Data.Repository.IRepository
{
    public interface IQuizAttemptRepository : IRepository<QuizAttempt>
    {
        void Update(QuizAttempt entity);
    }
}
