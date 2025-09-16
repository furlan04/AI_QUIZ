using server_web.Model;
using server_web.Model.Dto;

namespace server_web.Application.Managers
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
