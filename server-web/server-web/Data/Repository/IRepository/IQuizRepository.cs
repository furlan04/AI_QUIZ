using server_web.Model;

namespace server_web.Data.Repository.IRepository
{
    public interface IQuizRepository : IRepository<Quiz>
    {
        void Update(Quiz entity);
        Task<Quiz> GetQuizWithQuestions(Guid id);
    }
}
