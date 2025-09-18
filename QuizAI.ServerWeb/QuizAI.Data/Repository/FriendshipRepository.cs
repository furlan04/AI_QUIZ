using QuizAI.Data.Repository.IRepository;
using QuizAI.Model;

namespace QuizAI.Data.Repository
{
    public class FriendshipRepository: Repository<Friendship>, IFriendshipRepository
    {
        private ApplicationDbContext _db;
        public FriendshipRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public void Update(Friendship entity)
        {
            _db.Update(entity);
        }
    }
}
