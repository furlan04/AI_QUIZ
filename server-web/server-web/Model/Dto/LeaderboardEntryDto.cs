namespace server_web.Model.Dto
{
    public class LeaderboardEntryDto
    {
        public int Position { get; set; }
        public string UserName { get; set; } = null!;
        public int Score { get; set; }
        public decimal Percentage { get; set; }
        public DateTime CompletedAt { get; set; }
        public bool IsCurrentUser { get; set; }
    }
}
