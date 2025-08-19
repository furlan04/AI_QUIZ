namespace server_web.Model.Dto
{
    public class FriendDto
    {
        public Guid FriendshipId { get; set; }
        public string FriendEmail { get; set; }
        public FriendDto(Guid friendshipId, string friendEmail)
        {
            FriendshipId = friendshipId;
            FriendEmail= friendEmail;
        }
    }
}
