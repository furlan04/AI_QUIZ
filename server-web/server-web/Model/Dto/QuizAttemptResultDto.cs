namespace server_web.Model.Dto
{
    public class QuizAttemptResultDto
    {
        public Guid Id { get; set; }
        public Guid QuizId { get; set; }
        public DateTime CompletedAt { get; set; }
        public int Score { get; set; }
        public decimal Percentage { get; set; }
        public int TotalQuestions { get; set; }
    }
}
