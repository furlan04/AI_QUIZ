using QuizAI.Model;

namespace QuizAI.Data.Repository.IRepository
{
    public interface IQuizRepository : IRepository<Quiz>
    {
        void Update(Quiz entity);
        Task<Quiz> GetQuizWithQuestions(Guid id);
    }
}
