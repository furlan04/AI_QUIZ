using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using QuizAI.Application.Managers;
using QuizAI.Exceptions;
using QuizAI.Model;
using QuizAI.Model.Dto;

namespace QuizAI.Controllers
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
            try
            {
                var current_user = await _userManager.GetUserAsync(User);
                var received = await _friendshipManager.UserRequestsAsync(current_user!.Id);
                return Ok(received);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpPost("send-request/{email}")]
        public async Task<ActionResult<Friendship>> SendRequest(string email)
        {
            try
            {
                var current_user = await _userManager.GetUserAsync(User);

                var requested_user = await _userManager.FindByEmailAsync(email);
                if (requested_user == null)
                    return BadRequest("user does not exist");

                var friendship = await _friendshipManager.SendRequestsAsync(current_user!.Id, requested_user.Id);

                return Ok(friendship);
            }
            catch (FriendRequestException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpPut("accept-request/{friendshipId}")]
        public async Task<ActionResult<Friendship>> AcceptRequest(Guid friendshipId)
        {
            try
            {
                var current_user = await _userManager.GetUserAsync(User);
                var request = await _friendshipManager.AcceptRequestAsync(current_user!.Id, friendshipId);
                return Ok(request);
            }
            catch (KeyNotFoundException knfEx)
            {
                return NotFound(knfEx.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("friend-list")]
        public async Task<ActionResult<List<FriendDto>>> FriendList()
        {
            try
            {
                var current_user = await _userManager.GetUserAsync(User);
                var friendships = await _friendshipManager.UserFriendsAsync(current_user!.Id);
                return Ok(friendships);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("remove-friendship/{friendshipId}")]
        public async Task<ActionResult> RemoveFriendship(Guid friendshipId)
        {
            try
            {
                var current_user = await _userManager.GetUserAsync(User);
                await _friendshipManager.RemoveFriendAsync(current_user!.Id, friendshipId);
                return NoContent();
            }
            catch (KeyNotFoundException knf)
            {
                return BadRequest(knf.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
