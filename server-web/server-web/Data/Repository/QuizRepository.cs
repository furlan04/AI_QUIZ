using Microsoft.EntityFrameworkCore;
using server_web.Data.Repository.IRepository;
using server_web.Model;

namespace server_web.Data.Repository
{
    public class QuizRepository : Repository<Quiz>, IQuizRepository
    {
        private readonly ApplicationDbContext _db;
        public QuizRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public void Update(Quiz entity)
        {
            _db.Update(entity);
        }
        public Quiz GetQuizWithQuestions(Guid id)
        {
            return _db.Quizzes
                .Include(q => q.Questions)
                .FirstOrDefault(q => q.Id == id)!;
        }
    }
}
