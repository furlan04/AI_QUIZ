using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server_web.Data;
using server_web.Model;
using server_web.Model.Dto;
using server_web.Services.Quiz;
using System.Text.Json;

namespace server_web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class QuizController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IQuizService _quizService;

        public QuizController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IQuizService quizService)
        {
            _context = context;
            _userManager = userManager;
            _quizService = quizService;
        }
        // GET: api/Quiz
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Quiz>>> GetQuizzes(string? userId = null)
        {
            if (string.IsNullOrEmpty(userId))
            {
                var user = await _userManager.GetUserAsync(User);
                if (user == null)
                    return Unauthorized("User not authenticated");
                userId = user.Id;
            }

            var quizzes = await _context.Quizzes
                .Where(q => q.UserId == userId)
                .ToListAsync();

            return Ok(quizzes);
        }

        // GET: api/Quiz/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Quiz>> GetQuiz(Guid id)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null) return Unauthorized();

            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (quiz == null) return NotFound();

            var return_obj = new QuizDto(quiz);

            return Ok(return_obj);
        }

        // POST: api/Quiz
        [HttpPost("{topic}")]
        public async Task<ActionResult<Quiz>> CreateQuiz(string topic)
        {
            var user = await _userManager.GetUserAsync(User);

            if(user == null) return Unauthorized();

            var generated_quiz = await _quizService.GenerateQuizAsync(topic);

            var quiz = new Quiz
            {
                Title = generated_quiz.Title,
                Description = generated_quiz.Description,
                UserId = user.Id,
            };

            _context.Quizzes.Add(quiz);

            foreach (var q in generated_quiz.Questions)
            {
                var question = new Question
                {
                    QuizId = quiz.Id,
                    OptionsJson = JsonSerializer.Serialize(q.Options),
                    Text = q.Text,
                    CorrectAnswerIndex = q.CorrectAnswerIndex,
                    Order = q.Order,
                };
                _context.Questions.Add(question);
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQuiz), new { id = quiz.Id }, quiz);
        }

        // DELETE: api/Quiz/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuiz(Guid id)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null) return Unauthorized();

            var quiz = await _context.Quizzes
                .FirstOrDefaultAsync(q => q.Id == id && q.UserId == user.Id);

            if (quiz == null) return NotFound();

            _context.Quizzes.Remove(quiz);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpGet("GetLikedQuizzes")]
        public async Task<ActionResult<IEnumerable<Quiz>>> GetLikedQuizzes()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            var likes = await _context.LikeQuizzes
                .Where(l => l.UserId == user.Id)
                .ToListAsync();
            var quizzes = new List<Quiz>();
            foreach (var like in likes)
            {
                quizzes.Add(await _context.Quizzes.FindAsync(like.QuizId));
            }
            return Ok(quizzes);
        }
        [HttpPost("like/{id}")]
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
        [HttpDelete("like/{id}")]
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
        [HttpGet("GetAttemptedQuiz")]
        public async Task<ActionResult<IEnumerable<Quiz>>> GetAttemptedQuizzes()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();
            var attempts = await _context.QuizAttempts
                .Where(a => a.UserId == user.Id)
                .Select(a => a.Quiz)
                .ToListAsync();
            return Ok(attempts);
        }
    }
}
