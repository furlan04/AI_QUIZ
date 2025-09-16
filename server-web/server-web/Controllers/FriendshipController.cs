using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server_web.Application.Managers;
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
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IFriendshipManager _friendshipManager;
        public FriendshipController(IFriendshipManager friendshipManager, UserManager<ApplicationUser> userManager)
        {
            _friendshipManager = friendshipManager;
            _userManager = userManager;
        }
        [HttpGet("requests/")]
        public async Task<ActionResult<IEnumerable<FriendRequestDto>>> MyRequests()
        {
            var current_user = await _userManager.GetUserAsync(User);
            if (current_user == null) return BadRequest("not logged in");

            var received = _friendshipManager.UserRequests(current_user.Id);

            return Ok(received);
        }
        [HttpPost("send-request/{email}")]
        public async Task<ActionResult<Friendship>> SendRequest(string email)
        {
            var current_user = await _userManager.GetUserAsync(User);
            if (current_user == null) 
                return BadRequest("not logged in");

            var requested_user = await _userManager.FindByEmailAsync(email);
            if (requested_user == null) 
                return BadRequest("user does not exist");

            var friendship = _friendshipManager.SendRequests(current_user.Id, requested_user.Id);

            return Ok(friendship);
        }
        [HttpPut("accept-request/{friendshipId}")]
        public async Task<ActionResult<Friendship>> AcceptRequest(Guid friendshipId)
        {
            var current_user = await _userManager.GetUserAsync(User);
            if (current_user == null) return BadRequest("not logged in");
            try
            {
                var request = _friendshipManager.AcceptRequest(current_user.Id, friendshipId);
                return Ok(request);
            }
            catch (Exception)
            {
                return BadRequest("request has already been sent");
            }
        }

        [HttpGet("friend-list")]
        public async Task<ActionResult<List<FriendDto>>> FriendList()
        {
            var current_user = await _userManager.GetUserAsync(User);

            if (current_user == null) 
                return BadRequest("not logged in");

            var friendships = _friendshipManager.UserFriends(current_user.Id);

            return Ok(friendships);
        }

        [HttpDelete("remove-friendship/{friendshipId}")]
        public async Task<ActionResult> RemoveFrienship(Guid friendshipId)
        {
            var current_user = await _userManager.GetUserAsync(User);

            if (current_user == null) 
                return BadRequest("not logged in");

            _friendshipManager.RemoveFriend(current_user.Id, friendshipId);

            return NoContent();
        }
    }
}
