using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server_web.Data;
using server_web.Model;
using server_web.Model.Dto;

namespace server_web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FriendshipController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public FriendshipController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        [HttpGet("requests/")]
        public async Task<ActionResult<IEnumerable<FriendRequestDto>>> MyRequests()
        {
            var current_user = await _userManager.GetUserAsync(User);
            if (current_user == null) return BadRequest("not logged in");

            var received = await _context.Friendships
                .Where(f => f.ReceiverId == current_user.Id && !f.Accepted)
                .Select(f => new FriendRequestDto(f.Id, f.SendingUser.Email!))
                .ToListAsync();

            return Ok(received);
        }
        [HttpPost("send-request/{email}")]
        public async Task<ActionResult<Friendship>> SendRequest(string email)
        {
            var current_user = await _userManager.GetUserAsync(User);
            if (current_user == null) return BadRequest("not logged in");

            var requested_user = await _userManager.FindByEmailAsync(email);
            if (requested_user == null) return BadRequest("user does not exist");

            var existsAlreadyARequest = !_context.Friendships
                .Where(f => f.ReceiverId == requested_user.Id && f.SenderId == current_user.Id).IsNullOrEmpty();
            if (existsAlreadyARequest) return BadRequest("friend request already sent");

            var existsOpposite = await _context.Friendships
                .Where(f => f.ReceiverId == current_user.Id && f.SenderId == requested_user.Id).FirstOrDefaultAsync();
            if (existsOpposite != null) return await AcceptRequest(existsOpposite.Id);

            Friendship friendship = new Friendship(current_user.Id, requested_user.Id);
            _context.Friendships.Add(friendship);
            _context.SaveChanges();

            return Ok(friendship);
        }
        [HttpPut("accept-request/{friendshipId}")]
        public async Task<ActionResult<Friendship>> AcceptRequest(Guid friendshipId)
        {
            var current_user = await _userManager.GetUserAsync(User);
            if (current_user == null) return BadRequest("not logged in");

            var request = await _context.Friendships.FindAsync(friendshipId);

            if(request == null) return BadRequest("request doesn't exist");

            if (request.ReceiverId != current_user.Id) return BadRequest("you cannot accept this friend request");

            var requested_user = await _context.Users.FindAsync(request.SenderId);

            if (requested_user == null) return BadRequest("user does not exist");

            if (request.Accepted) return BadRequest("request already accepted");

            request.Accepted = true;
            _context.SaveChanges();
            return Ok(request);
        }

        [HttpGet("friend-list")]
        public async Task<ActionResult<List<FriendDto>>> FriendList()
        {
            var current_user = await _userManager.GetUserAsync(User);

            if (current_user == null) return BadRequest("not logged in");

            var friendships = await _context.Friendships
                .Where(f => f.Accepted && (f.SenderId == current_user.Id || f.ReceiverId == current_user.Id))
                .Select(f => new FriendDto{
                    FriendshipId = f.Id,
                    FriendEmail = f.SenderId == current_user.Id ? f.ReceivingUser.Email! : f.SendingUser.Email!,
                    FriendId = f.SenderId == current_user.Id ? f.ReceiverId : f.SenderId
                }).ToListAsync();

            return Ok(friendships);
        }

        [HttpDelete("remove-friendship/{friendshipId}")]
        public async Task<ActionResult> RemoveFrienship(Guid friendshipId)
        {
            var current_user = await _userManager.GetUserAsync(User);

            if (current_user == null) return BadRequest("not logged in");

            var request = await _context.Friendships.FindAsync(friendshipId);
            
            if (request == null) return BadRequest("friend request does not exist");

            var remove = _context.Remove(request);

            if (remove == null) return BadRequest("couldn't remove frienship");

            _context.SaveChanges();

            return Ok(request);
        }
    }
}
