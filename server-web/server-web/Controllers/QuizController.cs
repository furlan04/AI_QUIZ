using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server_web.Model;
using server_web.Application.Managers;

namespace server_web.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class QuizController : ControllerBase
    {
        private readonly IQuizManager _quizManager;
        private readonly UserManager<ApplicationUser> _userManager;
        public QuizController(UserManager<ApplicationUser> userManager, IQuizManager quizManager)
        {
            _userManager = userManager;
            _quizManager = quizManager;
        }
        // GET: api/Quiz
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Quiz>>> GetQuizzes(string? userId = null)
        {
            try
            {
                if (string.IsNullOrEmpty(userId))
                {
                    var user = await _userManager.GetUserAsync(User);
                    userId = user!.Id;
                }
                var quizzes = await _quizManager.GetQuizzesAsync(userId);
                return Ok(quizzes);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/Quiz/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Quiz>> GetQuiz(Guid id)
        {
            try
            {
                var quiz = await _quizManager.GetQuizAsync(id);
                return Ok(quiz);
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

        // POST: api/Quiz
        [HttpPost("{topic}")]
        public async Task<ActionResult<Quiz>> CreateQuiz(string topic)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                var quiz = await _quizManager.CreateQuizAsync(topic, user!.Id);
                return CreatedAtAction(nameof(GetQuiz), new { id = quiz.Id }, quiz);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/Quiz/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuiz(Guid id)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                await _quizManager.DeleteQuizAsync(id, user!.Id);
                return NoContent();
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
    }
}
