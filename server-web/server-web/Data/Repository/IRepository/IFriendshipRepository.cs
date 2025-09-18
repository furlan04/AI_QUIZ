using server_web.Model;

namespace server_web.Data.Repository.IRepository
{
    public interface IFriendshipRepository : IRepository<Friendship>
    {
        void Update(Friendship entity);
    }
}
