namespace QuizAI.Model.Dto
{
    public class QuizLeaderboardDto
    {
        public Guid QuizId { get; set; }
        public List<LeaderboardEntryDto> Entries { get; set; } = new List<LeaderboardEntryDto>();
    }
}
