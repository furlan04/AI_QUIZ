using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server_web.Data;
using server_web.Model;
using server_web.Model.Dto;
using server_web.Services;
using System.Security.Claims;

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
        [HttpGet("debug-claims")]
        public IActionResult DebugClaims()
        {
            return Ok(new
            {
                IsAuthenticated = User.Identity?.IsAuthenticated,
                AuthenticationType = User.Identity?.AuthenticationType,
                Claims = User.Claims.Select(c => new { Type = c.Type, Value = c.Value }).ToArray(),
                NameIdentifier = User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
                UserManagerId = _userManager.GetUserId(User)
            });
        }
        [AllowAnonymous]
        [HttpGet("test-quiz-generation")]
        public async Task<IActionResult> GenerationTest()
        {
            var resp = await _quizService.GenerateQuizAsync("geografia italiana");
            return Ok(resp);
        }
        // GET: api/Quiz
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Quiz>>> GetQuizzes()
        {
            var user = await _userManager.GetUserAsync(User);
            var quizzes = await _context.Quizzes
                .Where(q => q.UserId == user.Id)
                .ToListAsync();

            return Ok(quizzes);
        }

        // GET: api/Quiz/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Quiz>> GetQuiz(Guid id)
        {
            var user = await _userManager.GetUserAsync(User);
            var quiz = await _context.Quizzes
                .FirstOrDefaultAsync(q => q.Id == id && q.UserId == user.Id);

            if (quiz == null)
                return NotFound();

            return Ok(quiz);
        }

        // POST: api/Quiz
        [HttpPost]
        public async Task<ActionResult<Quiz>> CreateQuiz(CreateQuizDto createQuiz)
        {
            var user = await _userManager.GetUserAsync(User);

            if(user == null)
                return Unauthorized();

            var quiz = await _quizService.GenerateQuizAsync(createQuiz.Topic);
            
            quiz.UserId = user.Id;
            quiz.Title = createQuiz.Topic;
            quiz.Description = createQuiz.Topic;

            _context.Quizzes.Add(quiz);

            foreach (var q in quiz.Questions)
            {
                q.QuizId = quiz.Id;
                _context.Questions.Add(q);
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQuiz), new { id = quiz.Id }, quiz);
        }

        // DELETE: api/Quiz/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuiz(Guid id)
        {
            var user = await _userManager.GetUserAsync(User);
            var quiz = await _context.Quizzes
                .FirstOrDefaultAsync(q => q.Id == id && q.UserId == user.Id);

            if (quiz == null)
                return NotFound();

            _context.Quizzes.Remove(quiz);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
