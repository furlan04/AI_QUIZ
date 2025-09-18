using server_web.Data.Repository.IRepository;
using server_web.Model;

namespace server_web.Data.Repository
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
