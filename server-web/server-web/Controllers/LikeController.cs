using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server_web.Data;
using server_web.Model;
using server_web.Services.Quiz;

namespace server_web.Controllers
{
    public class LikeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        public LikeController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        [HttpPost("{id}")]
        public async Task<ActionResult<LikeQuiz>> LikeQuiz(Guid id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            var quiz = await _context.Quizzes.FindAsync(id);
            if (quiz == null) return NotFound("Quiz not found");
            var existingLike = await _context.LikeQuizzes
                .FirstOrDefaultAsync(l => l.QuizId == id && l.UserId == user.Id);
            if (existingLike != null)
                return BadRequest("You have already liked this quiz");
            var like = new LikeQuiz
            {
                QuizId = id,
                UserId = user.Id
            };
            _context.LikeQuizzes.Add(like);
            await _context.SaveChangesAsync();
            return Ok(like);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> UnlikeQuiz(Guid id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            var existingLike = await _context.LikeQuizzes
                .FirstOrDefaultAsync(l => l.QuizId == id && l.UserId == user.Id);
            if (existingLike == null)
                return NotFound("You have not liked this quiz");
            _context.LikeQuizzes.Remove(existingLike);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
