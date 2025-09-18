using QuizAI.Data.Repository.IRepository;
using QuizAI.Model;

namespace QuizAI.Data.Repository
{
    public class QuizAttemptRepository : Repository<QuizAttempt>, IQuizAttemptRepository
    {
        private readonly ApplicationDbContext _db;
        public QuizAttemptRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public void Update(QuizAttempt entity)
        {
            _db.Update(entity);
        }
    }
}
