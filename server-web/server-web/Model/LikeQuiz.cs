using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace server_web.Model
{
    public class LikeQuiz
    {
        [Required]
        public Guid QuizId { get; set; }
        [ForeignKey("QuizId")]
        [JsonIgnore]
        public Quiz Quiz { get; set; } = null!;
        [Required]
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        [JsonIgnore]
        public ApplicationUser User { get; set; } = null!;
    }
}
