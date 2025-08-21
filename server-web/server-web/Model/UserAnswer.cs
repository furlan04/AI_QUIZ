using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace server_web.Model
{
    public class UserAnswer
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid QuizAttemptId { get; set; }

        [ForeignKey("QuizAttemptId")]
        [JsonIgnore]
        public QuizAttempt QuizAttempt { get; set; } = null!;

        [Required]
        public Guid QuestionQuizId { get; set; }

        [Required]
        public int QuestionOrder { get; set; }

        // Navigazione verso Question
        [ForeignKey("QuestionQuizId,QuestionOrder")]
        [JsonIgnore]
        public Question Question { get; set; } = null!;

        // Indice della risposta selezionata (0-3)
        [Range(0, 3)]
        public int SelectedAnswerIndex { get; set; }

        // Campo calcolato per verificare se la risposta è corretta
        [NotMapped]
        public bool IsCorrect => Question != null && SelectedAnswerIndex == Question.CorrectAnswerIndex;
    }
}
