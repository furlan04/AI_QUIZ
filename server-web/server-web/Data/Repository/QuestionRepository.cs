using server_web.Data.Repository.IRepository;
using server_web.Model;

namespace server_web.Data.Repository
{
    public class QuestionRepository : Repository<Question>, IQuestionRepository
    {
        private readonly ApplicationDbContext _db;
        public QuestionRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        public void Update(Question entity)
        {
            _db.Update(entity);
        }
    }
}
