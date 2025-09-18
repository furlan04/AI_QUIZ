using QuizAI.Model;

namespace QuizAI.Data.Repository.IRepository
{
    public interface IUserAnswerRepository : IRepository<UserAnswer>
    {
        void Update(UserAnswer entity);
    }
}
