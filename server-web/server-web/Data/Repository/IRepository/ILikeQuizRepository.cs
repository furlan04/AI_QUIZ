using server_web.Model;

namespace server_web.Data.Repository.IRepository
{
    public interface ILikeQuizRepository : IRepository<LikeQuiz>
    {
        void Update(LikeQuiz entity);
    }
}
