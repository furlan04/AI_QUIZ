using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;

namespace server_web.Model
{
    public class ApplicationUser : IdentityUser
    {
        [JsonIgnore]
        public ICollection<Quiz> Quizzes { get; set; } = new List<Quiz>();
        [JsonIgnore]
        public ICollection<Friendship> SentRequests { get; set; } = new HashSet<Friendship>();
        [JsonIgnore]
        public ICollection<Friendship> ReceivedRequests { get; set; } = new HashSet<Friendship>();
        [JsonIgnore]
        public ICollection<LikeQuiz> LikedQuizzes { get; set; } = new HashSet<LikeQuiz>();
        [JsonIgnore]
        public ICollection<QuizAttempt> QuizAttempts { get; set; } = new List<QuizAttempt>();
    }
}
