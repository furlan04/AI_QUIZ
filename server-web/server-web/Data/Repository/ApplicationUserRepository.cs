using server_web.Data.Repository.IRepository;
using server_web.Model;

namespace server_web.Data.Repository
{
    public class ApplicationUserRepository : Repository<ApplicationUser>, IApplicationUserRepository
    {
        private ApplicationDbContext _db;
        public ApplicationUserRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public void Update(ApplicationUser entity)
        {
            _db.Update(entity);
        }
    }
}
