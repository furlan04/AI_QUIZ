using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server_web.Application.Managers;
using server_web.Data;
using server_web.Model;
using server_web.Model.Dto;
using System.Security.Claims;

namespace server_web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class QuizAttemptController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IQuizAttemptManager _quizAttemptManager;

        public QuizAttemptController(
            IQuizAttemptManager quizAttemptManager,
            UserManager<ApplicationUser> userManager)
        {
            _quizAttemptManager = quizAttemptManager;
            _userManager = userManager;
        }
        [HttpPost("submit")]
        public async Task<ActionResult<QuizAttemptResultDto>> SubmitQuizAnswers([FromBody] SubmitQuizAnswersDto dto)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                var result = await _quizAttemptManager.SubmitQuizAnswersAsync(dto, user!.Id);
                return Ok(result);
            }
            catch (KeyNotFoundException knfEx)
            {
                return NotFound(knfEx.Message);
            }
            catch (ArgumentException argEx)
            {
                return BadRequest(argEx.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("{attemptId}/review")]
        public async Task<ActionResult<QuizAttemptReviewDto>> GetQuizAttemptReview(Guid attemptId)
        {
            try
            {
                var userId = await _userManager.GetUserAsync(User);
                var reviewDto = await _quizAttemptManager.GetQuizAttemptReviewAsync(attemptId, userId!.Id);
                return Ok(reviewDto);
            }
            catch (KeyNotFoundException knfEx)
            {
                return NotFound(knfEx.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("leaderboard/{quizId}")]
        public async Task<ActionResult<QuizLeaderboardDto>> GetQuizLeaderboard(Guid quizId, [FromQuery] int limit = 50)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                var leaderboard = await _quizAttemptManager.GetQuizLeaderboardAsync(user!.Id, quizId, limit);
                return Ok(leaderboard);
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
        [HttpGet("my-attempts/{quizId}")]
        public async Task<ActionResult<List<QuizAttemptResultDto>>> GetMyAttempts(Guid quizId)
        {
            try
            {
                var user = await _userManager.GetUserAsync(User);
                var attempts = await _quizAttemptManager.GetUserAttemptsAsync(quizId, user!.Id);
                return Ok(attempts);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}