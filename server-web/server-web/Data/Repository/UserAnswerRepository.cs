using server_web.Data.Repository.IRepository;
using server_web.Model;

namespace server_web.Data.Repository
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
