using System.ComponentModel.DataAnnotations;

namespace QuizAI.Model.Dto
{
    public class UserAnswerDto
    {
        [Required]
        public Guid QuestionQuizId { get; set; }

        [Required]
        public int QuestionOrder { get; set; }

        [Required]
        [Range(0, 3)]
        public int SelectedAnswerIndex { get; set; }
    }
}
