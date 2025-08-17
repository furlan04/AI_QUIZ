namespace server_web.Model.Dto
{
    public class FriendshipRequestListDto
    {
        public List<Friendship> Sent { get; set; }
        public List<Friendship> Received { get; set; }
        public FriendshipRequestListDto(List<Friendship> sent, List<Friendship> received) 
        {
            Sent = sent;
            Received = received;
        }
    }
}
