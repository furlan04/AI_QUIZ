namespace server_web.Model.Dto
{
    public class SettingsDto
    {
        public string UserId { get; set; } = null!;
        public string Email { get; set; } = null!;
        public bool IsEmailConfirmed { get; set; }
    }
}
