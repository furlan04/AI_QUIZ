using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace server_web.Model
{
    public class Quiz
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = null!;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Indica se il quiz è attivo/pubblicato
        public bool IsActive { get; set; } = true;

        // Relazione con l'utente (creatore del quiz)
        [Required]
        public string UserId { get; set; } = null!;

        [ForeignKey("UserId")]
        [JsonIgnore]
        public ApplicationUser User { get; set; } = null!;

        // Navigazione verso le domande (sempre 10)
        public ICollection<Question> Questions { get; set; } = new List<Question>();

        // Navigazione verso i tentativi di completamento
        [JsonIgnore]
        public ICollection<QuizAttempt> Attempts { get; set; } = new List<QuizAttempt>();
    }
}