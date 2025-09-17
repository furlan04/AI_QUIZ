using Microsoft.EntityFrameworkCore;
using server_web.Data.Repository.IRepository;
using server_web.Exceptions;
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
        public async Task<IEnumerable<FriendRequestDto>> UserRequestsAsync(string userId)
        {
            var requests = await _unitOfWork.Friendship
                .GetAllAsync(f => f.ReceiverId == userId && !f.Accepted, "SendingUser");
            return requests.Select(fr => new FriendRequestDto(fr.Id, fr.SendingUser.Email!));
        }
        public async Task<Friendship> SendRequestsAsync(string senderId, string receiverId)
        {
            var exists = await _unitOfWork.Friendship
                .GetFirstOrDefaultAsync(f => f.SenderId == senderId && f.ReceiverId == receiverId);
            if (exists != null) 
                throw new FriendRequestException("Richiesta già inviata");
            var exists_reverse = await _unitOfWork.Friendship
                .GetFirstOrDefaultAsync(f => f.ReceiverId == senderId && f.SenderId == receiverId);
            if (exists_reverse != null) 
                return await AcceptRequestAsync(senderId, exists_reverse.Id);
            Friendship friendship = new Friendship(senderId, receiverId);
            await _unitOfWork.Friendship.AddAsync(friendship);
            await _unitOfWork.SaveAsync();
            return friendship;
        }
        public async Task<Friendship> AcceptRequestAsync(string userId, Guid requestId)
        {
            var request = await _unitOfWork.Friendship
                .GetFirstOrDefaultAsync(f => f.Id == requestId && f.ReceiverId == userId);
            if (request == null) throw new KeyNotFoundException("Richiesta non trovata");
            request.Accepted = true;
            _unitOfWork.Friendship.Update(request);
            await _unitOfWork.SaveAsync();
            return request;
        }
        public async Task<IEnumerable<FriendDto>> UserFriendsAsync(string userId)
        {
            var friends = await _unitOfWork.Friendship
                .GetAllAsync(f => (f.SenderId == userId || f.ReceiverId == userId) && f.Accepted, "ReceivingUser,SendingUser");
            return friends.Select(f => new FriendDto
            {
                FriendshipId = f.Id,
                FriendId = f.SenderId == userId ? f.ReceiverId : f.SenderId,
                FriendEmail = f.SenderId == userId ? f.ReceivingUser.Email! : f.SendingUser.Email!
            });
        }
        public async Task RemoveFriendAsync(string userId, Guid friendshipId)
        {
            var friendship = await _unitOfWork.Friendship
                .GetFirstOrDefaultAsync(f => f.Id == friendshipId && (f.SenderId == userId || f.ReceiverId == userId));
            if (friendship == null) throw new KeyNotFoundException("Amicizia non trovata");
            _unitOfWork.Friendship.Remove(friendship);
            await _unitOfWork.SaveAsync();
        }
    }
}
