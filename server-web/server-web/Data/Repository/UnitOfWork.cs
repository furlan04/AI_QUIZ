using server_web.Data.Repository.IRepository;

namespace server_web.Data.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private ApplicationDbContext _db;
        public UnitOfWork(ApplicationDbContext db) 
        { 
            this._db = db;
            Question = new QuestionRepository(_db);
            Quiz = new QuizRepository(_db);
            QuizAttempt = new QuizAttemptRepository(_db);
            UserAnswer = new UserAnswerRepository(_db);
            Friendship = new FriendshipRepository(_db);
            LikeQuiz = new LikeQuizRepository(_db);
        }
        public IFriendshipRepository Friendship { get; private set; }
        public ILikeQuizRepository LikeQuiz { get; private set; }
        public IQuizAttemptRepository QuizAttempt { get; private set; }
        public IQuizRepository Quiz { get; private set; }
        public IQuestionRepository Question { get; private set; }
        public IUserAnswerRepository UserAnswer { get; private set; }
        public async Task SaveAsync()
        {
            await _db.SaveChangesAsync();
        }
    }
}
