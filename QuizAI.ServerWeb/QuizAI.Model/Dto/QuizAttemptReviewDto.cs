namespace QuizAI.Model.Dto
{
    public class QuizAttemptReviewDto
    {
        public Guid Id { get; set; }
        public Guid QuizId { get; set; }
        public DateTime CompletedAt { get; set; }
        public int Score { get; set; }
        public decimal Percentage { get; set; }
        public int TotalQuestions { get; set; }
        public List<QuestionReviewDto> Questions { get; set; } = new List<QuestionReviewDto>();
    }
}
