namespace server_web.Model.Dto
{
    public class QuizDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public bool IsActive { get; set; } = true;
        public string UserId { get; set; } = null!;
        public ICollection<Question> Questions { get; set; } = new List<Question>();
        public QuizDto(Quiz quiz)
        {
            Id = quiz.Id;
            Title = quiz.Title;
            Description = quiz.Description;
            CreatedAt = quiz.CreatedAt;
            IsActive = quiz.IsActive;
            UserId = quiz.UserId;
            Questions = quiz.Questions;
        }
    }
}
