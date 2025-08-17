namespace server_web.Model
{
    public class FriendshipDto
    {
        public string SenderId { get; set; } = null!;
        public string ReceiverId { get; set; } = null!;
        public bool Accepted { get; set; } = false;
        public FriendshipDto(string senderId, string receiverId)
        {
            SenderId = senderId;
            ReceiverId = receiverId;
            Accepted = false;
        }
    }
}
