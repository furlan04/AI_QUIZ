using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server_web.Application.Managers;
using server_web.Data;
using server_web.Model;
using server_web.Model.Dto;

namespace server_web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IFriendshipManager _friendshipManager;
        private readonly IQuizManager _quizManager;
        private readonly ILikeManager _likeManager;
        private readonly IQuizAttemptManager _quizAttemptManager;
        public UserController(
            IFriendshipManager friendshipManager,
            IQuizManager quizManager,
            ILikeManager likeManager,
            IQuizAttemptManager quizAttemptManager,
            UserManager<ApplicationUser> userManager)
        {
            _friendshipManager = friendshipManager;
            _likeManager = likeManager;
            _quizManager = quizManager;
            _quizAttemptManager = quizAttemptManager;
            _userManager = userManager;
        }
        [HttpGet("GetProfile")]
        public async Task<ActionResult<UserProfileDTO>> GetProfile(string? userId = null)
        {
            if (userId == null)
            {
                var user = await _userManager.GetUserAsync(User);
                userId = user!.Id;
            }
            var userEntity = await _userManager.FindByIdAsync(userId);
            if (userEntity == null)
                return NotFound("User not found");
            var friend = await _friendshipManager.UserFriendsAsync(userId);
            var profile = new UserProfileDTO
            {
                UserId = userId,
                Email = userEntity.Email!,
                FriendsCount = friend.Count(),
            };
            return Ok(profile);
        }
        [HttpGet("LoadFeed")]
        public async Task<ActionResult<IEnumerable<Quiz>>> GetFeed()
        {
            var user = await _userManager.GetUserAsync(User);
            var userId = user!.Id;
            var friends = await _friendshipManager.UserFriendsAsync(userId);
            var friendsId = friends.Select(f => f.FriendId).ToList();
            var recentQuizzes = new List<Quiz>();
            foreach (var friendId in friendsId)
            {
                var quizzes = await _quizManager.GetQuizzesAsync(friendId);
                recentQuizzes.AddRange(quizzes);
            }
            return Ok(recentQuizzes.Take(20));
        }
        [HttpGet("GetSettings")]
        public async Task<ActionResult<SettingsDto>> GetSettings()
        {
            var user = await _userManager.GetUserAsync(User);
            var settings = new SettingsDto
            {
                UserId = user.Id,
                Email = user.Email!,
                IsEmailConfirmed = user.EmailConfirmed
            };
            return Ok(settings);
        }
        [HttpGet("GetLikedQuizzes")]
        public async Task<ActionResult<IEnumerable<Quiz>>> GetLikedQuizzes()
        {

            var user = await _userManager.GetUserAsync(User);
            var quizzes = await _likeManager.GetLikedQuizzesAsync(user!.Id);
            return Ok(quizzes);
        }
        [HttpGet("GetAttemptedQuizzes")]
        public async Task<ActionResult<IEnumerable<Quiz>>> GetAttemptedQuizzes()
        {
            var user = await _userManager.GetUserAsync(User);
            var quizzes = await _quizAttemptManager.GetAllAttemptedQuiz(user!.Id);
            return Ok(new HashSet<Quiz>(quizzes));
        }
    }
}
