using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        [HttpGet("GetProfile")]
        public async Task<ActionResult<UserProfileDTO>> GetProfile(string? userId = null)
        {
            if (userId == null)
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                    return Unauthorized("User not authenticated");
                userId = user.Id;
            }
            var userEntity = await _userManager.FindByIdAsync(userId);
            if (userEntity == null)
                return NotFound("User not found");
            var friendCountReceived = await _context.Friendships
                .CountAsync(f => f.ReceiverId == userId && f.Accepted);
            var friendCountSend = await _context.Friendships
                .CountAsync(f => f.SenderId == userId && f.Accepted);
            var profile = new UserProfileDTO
            {
                UserId = userId,
                Email = userEntity.Email!,
                FriendsCount = friendCountReceived + friendCountSend,
            };
            return Ok(profile);
        }
        [HttpGet("LoadFeed")]
        public async Task<ActionResult<IEnumerable<Quiz>>> GetFeed()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized("User not authenticated");
            var userId = user.Id;
            var friendIdsReceived = await _context.Friendships
                .Where(f => f.ReceiverId == userId && f.Accepted)
                .Select(f => f.SenderId)
                .ToListAsync();
            var friendIdsSend = await _context.Friendships
                .Where(f => f.SenderId == userId && f.Accepted)
                .Select(f => f.ReceiverId)
                .ToListAsync();
            var friendIds = friendIdsReceived.Concat(friendIdsSend).ToList();
            var recentQuizzes = await _context.Quizzes
                .Where(q => friendIds.Contains(q.UserId))
                .OrderByDescending(q => q.CreatedAt)
                .Take(20)
                .ToListAsync();
            return Ok(recentQuizzes);
        }
        [HttpGet("GetSettings")]
        public async Task<ActionResult<SettingsDto>> GetSettings()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized("User not authenticated");
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
            if (user == null) return Unauthorized();
            var quizIds = _context.LikeQuizzes
                .Where(qa => qa.UserId == user.Id)
                .Select(qa => qa.QuizId)
                .ToList();
            var quizzes = new List<Quiz>();
            foreach (var id in quizIds)
            {
                quizzes.Add(await _context.Quizzes.FindAsync(id));
            }
            return Ok(quizzes);
        }
        [HttpGet("GetAttemptedQuizzes")]
        public async Task<ActionResult<IEnumerable<Quiz>>> GetAttemptedQuizzes()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            var quizIds = _context.QuizAttempts
                .Where(qa => qa.UserId == user.Id)
                .Select(qa => qa.QuizId)
                .ToList();
            var quizzes = new List<Quiz>();
            foreach(var id in quizIds)
            {
                quizzes.Add(await _context.Quizzes.FindAsync(id));
            }
            return Ok(quizzes);
        }
    }
}
