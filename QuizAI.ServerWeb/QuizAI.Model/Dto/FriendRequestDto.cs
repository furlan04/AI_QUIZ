namespace QuizAI.Model.Dto
{
    public class FriendRequestDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public FriendRequestDto(Guid id, string email)
        {
            Id = id;
            Email = email;
        }
    }
}
