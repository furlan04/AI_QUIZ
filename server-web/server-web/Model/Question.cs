using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace server_web.Model
{
    public class Question
    {
        [Required]
        public Guid QuizId { get; set; }

        [ForeignKey("QuizId")]
        [JsonIgnore]
        public Quiz Quiz { get; set; } = null!;

        [Range(1, 10)]
        public int Order { get; set; }

        [Required]
        [MaxLength(500)]
        public string Text { get; set; } = null!;

        // Opzioni di risposta serializzate come JSON (sempre 4)
        [Required]
        public string OptionsJson { get; set; } = null!;

        // Indice della risposta corretta (0-3)
        [Range(0, 3)]
        public int CorrectAnswerIndex { get; set; }

        // Proprietà calcolata per deserializzare le opzioni
        [NotMapped]
        public List<string> Options
        {
            get => string.IsNullOrEmpty(OptionsJson)
                ? new List<string>()
                : JsonSerializer.Deserialize<List<string>>(OptionsJson) ?? new List<string>();
            set => OptionsJson = JsonSerializer.Serialize(value);
        }

        // Navigazione verso le risposte degli utenti
        [JsonIgnore]
        public ICollection<UserAnswer> UserAnswers { get; set; } = new List<UserAnswer>();
    }
}
