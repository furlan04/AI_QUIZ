namespace QuizAI.Model.Dto
{
    public class QuestionReviewDto
    {
        public Guid QuestionQuizId { get; set; }
        public int QuestionOrder { get; set; }
        public string QuestionText { get; set; } = null!;
        public List<string> Options { get; set; } = new List<string>();
        public int SelectedAnswerIndex { get; set; }
        public int CorrectAnswerIndex { get; set; }
        public bool IsCorrect { get; set; }
    }
}
