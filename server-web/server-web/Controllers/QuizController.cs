using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server_web.Data;
using server_web.Model;
using server_web.Model.Dto;
using server_web.Application.ExternalServices.Quiz;
using System.Text.Json;
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
        public QuizController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IQuizManager quizManager)
        {
            _userManager = userManager;
            _quizManager = quizManager;
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
            var quizzes = await _quizManager.GetQuizzesAsync(userId);
            return Ok(quizzes);
        }

        // GET: api/Quiz/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Quiz>> GetQuiz(Guid id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) 
                return Unauthorized();
            var quiz = await _quizManager.GetQuizAsync(id);
            if (quiz == null) 
                return NotFound();
            return Ok(quiz);
        }

        // POST: api/Quiz
        [HttpPost("{topic}")]
        public async Task<ActionResult<Quiz>> CreateQuiz(string topic)
        {
            var user = await _userManager.GetUserAsync(User);
            if(user == null) 
                return Unauthorized();
            var quiz = await _quizManager.CreateQuizAsync(topic, user.Id);
            return CreatedAtAction(nameof(GetQuiz), new { id = quiz.Id }, quiz);
        }

        // DELETE: api/Quiz/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuiz(Guid id)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) 
                return Unauthorized();
            try
            {
                await _quizManager.DeleteQuizAsync(id, user.Id);
                return NoContent();
            }
            catch (Exception)
            {
                return NotFound();
            }
        }
    }
}
