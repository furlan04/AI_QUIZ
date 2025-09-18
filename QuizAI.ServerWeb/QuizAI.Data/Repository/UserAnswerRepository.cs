using QuizAI.Data.Repository.IRepository;
using QuizAI.Model;

namespace QuizAI.Data.Repository
{
    public class UserAnswerRepository : Repository<UserAnswer>, IUserAnswerRepository
    {
        private readonly ApplicationDbContext _db;
        public UserAnswerRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public void Update(UserAnswer entity)
        {
            _db.Update(entity);
        }
    }
}
