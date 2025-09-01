using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public QuizAttemptController(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        private string GetCurrentUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException("User not found");
        }

        /// <summary>
        /// Invia le risposte per un quiz e calcola il punteggio
        /// </summary>
        [HttpPost("submit")]
        public async Task<ActionResult<QuizAttemptResultDto>> SubmitQuizAnswers([FromBody] SubmitQuizAnswersDto dto)
        {
            var userId = GetCurrentUserId();

            // Verifica che il quiz esista
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.Id == dto.QuizId);

            if (quiz == null)
            {
                return NotFound($"Quiz with ID {dto.QuizId} not found");
            }

            // Verifica che tutte le domande esistano
            var existingQuestions = await _context.Questions
                .Where(q => q.QuizId == dto.QuizId)
                .ToListAsync();

            // Verifica che tutte le domande richieste esistano
            var requestedOrders = dto.Answers.Select(a => a.QuestionOrder).ToList();
            var existingOrders = existingQuestions.Select(q => q.Order).ToList();

            if (existingQuestions.Count != dto.Answers.Count)
            {
                return BadRequest("Some questions were not found or invalid");
            }

            if (existingQuestions.Count != dto.Answers.Count)
            {
                return BadRequest("Some questions were not found or invalid");
            }

            // Crea il tentativo
            var attempt = new QuizAttempt
            {
                QuizId = dto.QuizId,
                UserId = userId,
                CompletedAt = DateTime.UtcNow
            };

            _context.QuizAttempts.Add(attempt);
            await _context.SaveChangesAsync();

            // Crea le risposte dell'utente
            var userAnswers = new List<UserAnswer>();
            var correctAnswers = 0;

            foreach (var answerDto in dto.Answers)
            {
                var question = existingQuestions.FirstOrDefault(q =>
                    q.QuizId == answerDto.QuestionQuizId &&
                    q.Order == answerDto.QuestionOrder);

                if (question == null)
                {
                    return BadRequest($"Question with order {answerDto.QuestionOrder} not found");
                }

                var userAnswer = new UserAnswer
                {
                    QuizAttemptId = attempt.Id,
                    QuestionQuizId = answerDto.QuestionQuizId,
                    QuestionOrder = answerDto.QuestionOrder,
                    SelectedAnswerIndex = answerDto.SelectedAnswerIndex
                };

                // Verifica se la risposta è corretta
                if (answerDto.SelectedAnswerIndex == question.CorrectAnswerIndex)
                {
                    correctAnswers++;
                }

                userAnswers.Add(userAnswer);
            }

            // Calcola punteggio e percentuale
            var totalQuestions = dto.Answers.Count;
            var score = correctAnswers;
            var percentage = totalQuestions > 0 ? Math.Round((decimal)correctAnswers / totalQuestions * 100, 2) : 0;

            attempt.Score = score;
            attempt.Percentage = percentage;

            _context.UserAnswers.AddRange(userAnswers);
            await _context.SaveChangesAsync();

            return Ok(new QuizAttemptResultDto
            {
                Id = attempt.Id,
                QuizId = quiz.Id,
                CompletedAt = attempt.CompletedAt ?? DateTime.UtcNow,
                Score = score,
                Percentage = percentage,
                TotalQuestions = totalQuestions
            });
        }

        /// <summary>
        /// Ottiene i dettagli di revisione per un tentativo di quiz
        /// </summary>
        [HttpGet("{attemptId}/review")]
        public async Task<ActionResult<QuizAttemptReviewDto>> GetQuizAttemptReview(Guid attemptId)
        {
            var userId = GetCurrentUserId();

            var attempt = await _context.QuizAttempts
                .Include(a => a.UserAnswers)
                    .ThenInclude(ua => ua.Question)
                .FirstOrDefaultAsync(a => a.Id == attemptId && a.UserId == userId);

            if (attempt == null)
            {
                return NotFound($"Quiz attempt with ID {attemptId} not found or not accessible");
            }

            var questions = attempt.UserAnswers
                .OrderBy(ua => ua.QuestionOrder)
                .Select(ua => new QuestionReviewDto
                {
                    QuestionQuizId = ua.QuestionQuizId,
                    QuestionOrder = ua.QuestionOrder,
                    QuestionText = ua.Question.Text,
                    Options = ua.Question.Options,
                    SelectedAnswerIndex = ua.SelectedAnswerIndex,
                    CorrectAnswerIndex = ua.Question.CorrectAnswerIndex,
                    IsCorrect = ua.IsCorrect
                })
                .ToList();

            var reviewDto = new QuizAttemptReviewDto
            {
                Id = attempt.Id,
                QuizId = attempt.QuizId,
                CompletedAt = attempt.CompletedAt ?? DateTime.UtcNow,
                Score = attempt.Score ?? 0,
                Percentage = attempt.Percentage ?? 0,
                TotalQuestions = questions.Count,
                Questions = questions
            };

            return Ok(reviewDto);
        }

        /// <summary>
        /// Ottiene la classifica per un quiz specifico
        /// </summary>
        [HttpGet("leaderboard/{quizId}")]
        public async Task<ActionResult<QuizLeaderboardDto>> GetQuizLeaderboard(Guid quizId, [FromQuery] int limit = 50)
        {
            var currentUserId = GetCurrentUserId();

            // Verifica che il quiz esista
            var quizExists = await _context.Quizzes.AnyAsync(q => q.Id == quizId);
            if (!quizExists)
            {
                return NotFound($"Quiz with ID {quizId} not found");
            }

            // Ottieni i migliori tentativi per ogni utente
            var groupedAttempts = await _context.QuizAttempts
                .Where(a => a.QuizId == quizId && a.Score.HasValue)
                .Include(a => a.User)
                .ToListAsync();

            var bestAttempts = groupedAttempts
                .GroupBy(a => a.UserId)
                .Select(g => g.OrderByDescending(a => a.Percentage)
                    .ThenByDescending(a => a.Score)
                    .ThenBy(a => a.CompletedAt)
                    .First())
                .OrderByDescending(a => a.Percentage)
                .ThenByDescending(a => a.Score)
                .ThenBy(a => a.CompletedAt)
                .Take(limit)
                .ToList();

            var entries = bestAttempts.Select((attempt, index) => new LeaderboardEntryDto
            {
                Position = index + 1,
                UserName = attempt.User.UserName ?? "Unknown",
                Score = attempt.Score ?? 0,
                Percentage = attempt.Percentage ?? 0,
                CompletedAt = attempt.CompletedAt ?? DateTime.MinValue,
                IsCurrentUser = attempt.UserId == currentUserId
            }).ToList();

            return Ok(new QuizLeaderboardDto
            {
                QuizId = quizId,
                Entries = entries
            });
        }

        /// <summary>
        /// Ottiene tutti i tentativi dell'utente corrente per un quiz
        /// </summary>
        [HttpGet("my-attempts/{quizId}")]
        public async Task<ActionResult<List<QuizAttemptResultDto>>> GetMyAttempts(Guid quizId)
        {
            var userId = GetCurrentUserId();

            var attempts = await _context.QuizAttempts
                .Where(a => a.QuizId == quizId && a.UserId == userId && a.Score.HasValue)
                .OrderByDescending(a => a.CompletedAt)
                .Select(a => new QuizAttemptResultDto
                {
                    Id = a.Id,
                    QuizId = a.QuizId,
                    CompletedAt = a.CompletedAt ?? DateTime.MinValue,
                    Score = a.Score ?? 0,
                    Percentage = a.Percentage ?? 0,
                    TotalQuestions = a.UserAnswers.Count()
                })
                .ToListAsync();

            return Ok(attempts);
        }
    }
}