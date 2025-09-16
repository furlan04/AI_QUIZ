using server_web.Model;

namespace server_web.Data.Repository.IRepository
{
    public interface IApplicationUserRepository : IRepository<ApplicationUser>
    {
        void Update(ApplicationUser entity);
    }
}
