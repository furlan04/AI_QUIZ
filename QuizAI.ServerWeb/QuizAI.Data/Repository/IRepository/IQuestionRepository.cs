using QuizAI.Model;

namespace QuizAI.Data.Repository.IRepository
{
    public interface IQuestionRepository : IRepository<Question>
    {
        void Update(Question entity);
    }
}
