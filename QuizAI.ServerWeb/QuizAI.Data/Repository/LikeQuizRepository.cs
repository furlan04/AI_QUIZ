using QuizAI.Data.Repository.IRepository;
using QuizAI.Model;

namespace QuizAI.Data.Repository
{
    public class LikeQuizRepository : Repository<LikeQuiz>, ILikeQuizRepository
    {
        private ApplicationDbContext _db;
        public LikeQuizRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public void Update(LikeQuiz entity)
        {
            _db.Update(entity);
        }
    }
}
