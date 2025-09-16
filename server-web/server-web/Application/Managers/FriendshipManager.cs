using Microsoft.EntityFrameworkCore;
using server_web.Data.Repository.IRepository;
using server_web.Model;
using server_web.Model.Dto;

namespace server_web.Application.Managers
{
    public class FriendshipManager : IFriendshipManager
    {
        private readonly IUnitOfWork _unitOfWork;
        public FriendshipManager(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public IEnumerable<FriendRequestDto> UserRequests(string userId)
        {
            var requests = _unitOfWork.Friendship
                .GetAll("SendingUser")
                .Where(f => f.ReceiverId == userId && !f.Accepted);
            return requests.Select(fr => new FriendRequestDto(fr.Id, fr.SendingUser.Email!));
        }
        public Friendship SendRequests(string senderId, string receiverId)
        {
            var exists = _unitOfWork.Friendship
                .GetFirstOrDefault(f => f.SenderId == senderId && f.ReceiverId == receiverId);
            if (exists != null) 
                throw new Exception("Richiesta già inviata");
            var exists_reverse = _unitOfWork.Friendship
                .GetFirstOrDefault(f => f.ReceiverId == senderId && f.SenderId == receiverId);
            if (exists_reverse != null) 
                return AcceptRequest(senderId, exists_reverse.Id);
            Friendship friendship = new Friendship(senderId, receiverId);
            _unitOfWork.Friendship.Add(friendship);
            _unitOfWork.Save();
            return friendship;
        }
        public Friendship AcceptRequest(string userId, Guid requestId)
        {
            var request = _unitOfWork.Friendship
                .GetFirstOrDefault(f => f.Id == requestId && f.ReceiverId == userId);
            if (request == null) throw new KeyNotFoundException("Richiesta non trovata");
            request.Accepted = true;
            _unitOfWork.Friendship.Update(request);
            _unitOfWork.Save();
            return request;
        }
        public IEnumerable<FriendDto> UserFriends(string userId)
        {
            var friends = _unitOfWork.Friendship
                .GetAll("ReceivingUser,SendingUser")
                .Where(f => (f.SenderId == userId || f.ReceiverId == userId) && f.Accepted);
            return friends.Select(f => new FriendDto
            {
                FriendshipId = f.Id,
                FriendId = f.SenderId == userId ? f.ReceiverId : f.SenderId,
                FriendEmail = f.SenderId == userId ? f.ReceivingUser.Email! : f.SendingUser.Email!
            });
        }
        public void RemoveFriend(string userId, Guid friendshipId)
        {
            var friendship = _unitOfWork.Friendship
                .GetFirstOrDefault(f => f.Id == friendshipId && (f.SenderId == userId || f.ReceiverId == userId));
            if (friendship == null) throw new KeyNotFoundException("Amicizia non trovata");
            _unitOfWork.Friendship.Remove(friendship);
            _unitOfWork.Save();
        }
    }
}
