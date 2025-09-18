using QuizAI.Model;
using QuizAI.Model.Dto;

namespace QuizAI.Application.Managers
{
    public interface IFriendshipManager
    {
        Task<IEnumerable<FriendRequestDto>> UserRequestsAsync(string userId);
        Task<Friendship> SendRequestsAsync(string senderId, string receiverId);
        Task<Friendship> AcceptRequestAsync(string userId, Guid requestId);
        Task<IEnumerable<FriendDto>> UserFriendsAsync(string userId);
        Task RemoveFriendAsync(string userId, Guid friendshipId);
    }
}
