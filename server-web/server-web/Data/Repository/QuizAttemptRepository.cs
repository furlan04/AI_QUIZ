using server_web.Data.Repository.IRepository;
using server_web.Model;

namespace server_web.Data.Repository
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
