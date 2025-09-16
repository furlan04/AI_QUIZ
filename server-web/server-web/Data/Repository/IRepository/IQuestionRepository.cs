using server_web.Model;

namespace server_web.Data.Repository.IRepository
{
    public interface IQuestionRepository : IRepository<Question>
    {
        void Update(Question entity);
    }
}
