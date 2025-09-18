using QuizAI.Model;

namespace QuizAI.Data.Repository.IRepository
{
    public interface IFriendshipRepository : IRepository<Friendship>
    {
        void Update(Friendship entity);
    }
}
