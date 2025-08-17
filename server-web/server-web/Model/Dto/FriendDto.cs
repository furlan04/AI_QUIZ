namespace server_web.Model.Dto
{
    public class FriendDto
    {
        public string FriendId { get; set; }
        public FriendDto(string friendId)
        {
            FriendId = friendId;
        }
    }
}
