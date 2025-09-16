namespace server_web.Data.Repository.IRepository
{
    public interface IUnitOfWork
    {
        public IFriendshipRepository Friendship { get; }
        public ILikeQuizRepository LikeQuiz { get; }
        public IQuizAttemptRepository QuizAttempt { get; }
        public IQuizRepository Quiz { get; }
        public IQuestionRepository Question { get; }
        public IUserAnswerRepository UserAnswer { get; }
        public IApplicationUserRepository ApplicationUser { get; }
        public Task SaveAsync();
    }
}
