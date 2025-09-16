using server_web.Model;

namespace server_web.Data.Repository.IRepository
{
    public interface IUserAnswerRepository : IRepository<UserAnswer>
    {
        void Update(UserAnswer entity);
    }
}
