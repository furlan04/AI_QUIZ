namespace QuizAI.Model.Dto
{
    public class SettingsDto
    {
        public string UserId { get; set; } = null!;
        public string Email { get; set; } = null!;
        public bool IsEmailConfirmed { get; set; }
    }
}
