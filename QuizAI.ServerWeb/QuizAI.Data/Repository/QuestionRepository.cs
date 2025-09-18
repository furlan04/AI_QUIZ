using QuizAI.Data.Repository.IRepository;
using QuizAI.Model;

namespace QuizAI.Data.Repository
{
    public class QuestionRepository : Repository<Question>, IQuestionRepository
    {
        private readonly ApplicationDbContext _db;
        public QuestionRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public void Update(Question entity)
        {
            _db.Update(entity);
        }
    }
}
