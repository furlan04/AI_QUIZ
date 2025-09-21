namespace QuizAI.Model.Dto
{
    public class UserProfileDTO
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public int FriendsCount { get; set; }
        public bool IsCurrentUser { get; set; }
        public bool IsFriend { get; set; }
        public Guid? FriendshipId { get; set; }
        public bool HaveSentRequest { get; set; }
    }
}
