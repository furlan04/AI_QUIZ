using System.ComponentModel.DataAnnotations;

namespace QuizAI.Model.Dto
{
    public class SubmitQuizAnswersDto
    {
        [Required]
        public Guid QuizId { get; set; }

        [Required]
        [MinLength(1)]
        public List<UserAnswerDto> Answers { get; set; } = new List<UserAnswerDto>();
    }
}
