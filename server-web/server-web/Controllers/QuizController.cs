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
        // GET: api/Quiz
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Quiz>>> GetQuizzes(string userId)
        {
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

            if (user == null)
                return Unauthorized();

            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.Id == id);

            if (quiz == null)
                return NotFound();

            Console.WriteLine($"Quiz trovato: {quiz.Id}, Numero domande: {quiz.Questions?.Count ?? 0}");

            var return_obj = new QuizDto(quiz);

            return Ok(return_obj);
        }

        // POST: api/Quiz
        [HttpPost("{topic}")]
        public async Task<ActionResult<Quiz>> CreateQuiz(string topic)
        {
            var user = await _userManager.GetUserAsync(User);

            if(user == null)
                return Unauthorized();

            var quiz = await _quizService.GenerateQuizAsync(topic);
            
            quiz.UserId = user.Id;
            quiz.Title = topic;
            quiz.Description = topic;

            _context.Quizzes.Add(quiz);

            foreach (var q in quiz.Questions)
            {
                q.QuizId = quiz.Id;
                _context.Questions.Add(q);
                await _context.SaveChangesAsync();
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQuiz), new { id = quiz.Id }, quiz);
        }

        // DELETE: api/Quiz/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuiz(Guid id)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
                return Unauthorized();

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
