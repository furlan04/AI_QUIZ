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
    public class LikeController : ControllerBase
    {
        private readonly ILikeManager _likeManager;
        private readonly UserManager<ApplicationUser> _userManager;
        public LikeController(ILikeManager likeManager, UserManager<ApplicationUser> userManager)
        {
            _likeManager = likeManager;
            _userManager = userManager;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<LikedDto>> GetLikeStatus(Guid id)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                var result = await _likeManager.IsQuizLikedAsync(id, user!.Id);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpPost("{id}")]
        public async Task<ActionResult<LikeQuiz>> LikeQuiz(Guid id)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                var result = await _likeManager.LikeQuizAsync(id, user!.Id);
                return Ok(result);
            }
            catch (KeyNotFoundException knfEx)
            {
                return NotFound(knfEx.Message);
            }
            catch (LikeStatusException lsEx)
            {
                return BadRequest(lsEx.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> UnlikeQuiz(Guid id)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                await _likeManager.UnlikeQuizAsync(id, user!.Id);
                return NoContent();
            }
            catch (LikeStatusException lsEx)
            {
                return BadRequest(lsEx.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
