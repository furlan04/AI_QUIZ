using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace server_web.Model
{
    public class Friendship
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        [Required]
        public string SenderId { get; set; } = null!;
        [ForeignKey("SenderId")]
        [JsonIgnore]
        public ApplicationUser SendingUser { get; set; } = null!;
        [Required]
        public string ReceiverId { get; set; } = null!;
        [ForeignKey("ReceiverId")]
        [JsonIgnore]
        public ApplicationUser ReceivingUser { get; set; } = null!;
        public bool Accepted { get; set; } = false;
        public Friendship(string senderId, string receiverId)
        {
            SenderId = senderId;
            ReceiverId = receiverId;
            Accepted = false;
        }
    }
}
