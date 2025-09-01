using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace server_web.Model
{
    public class QuizAttempt
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid QuizId { get; set; }

        [ForeignKey("QuizId")]
        [JsonIgnore]
        public Quiz Quiz { get; set; } = null!;

        [Required]
        public string UserId { get; set; } = null!;

        [ForeignKey("UserId")]
        [JsonIgnore]
        public ApplicationUser User { get; set; } = null!;
        public DateTime? CompletedAt { get; set; } = DateTime.Now;
        // Punteggio finale (numero di risposte corrette su 10)
        [Range(0, 10)]
        public int? Score { get; set; }

        // Percentuale di successo
        [Range(0, 100)]
        public decimal? Percentage { get; set; }
        // Navigazione verso le risposte dell'utente
        [JsonIgnore]
        public ICollection<UserAnswer> UserAnswers { get; set; } = new List<UserAnswer>();
    }
}
