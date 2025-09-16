using server_web.Data.Repository.IRepository;
using server_web.Model;

namespace server_web.Data.Repository
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
