using server_web.Model;
using server_web.Model.Dto;

namespace server_web.Application.Managers
{
    public interface IFriendshipManager
    {
        IEnumerable<FriendRequestDto> UserRequests(string userId);
        Friendship SendRequests(string senderId, string receiverId);
        Friendship AcceptRequest(string userId, Guid requestId);
        IEnumerable<FriendDto> UserFriends(string userId);
        void RemoveFriend(string userId, Guid friendshipId);
    }
}
