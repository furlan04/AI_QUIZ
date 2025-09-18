using server_web.Data.Repository.IRepository;
using server_web.Exceptions;
using server_web.Model;
using server_web.Model.Dto;

namespace server_web.Application.Managers
{
    public class LikeManager : ILikeManager
    {
        private readonly IUnitOfWork _unitOfWork;
        public LikeManager(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<LikedDto> IsQuizLikedAsync(Guid quizId, string userId)
        {
            var likes = await _unitOfWork.LikeQuiz
                .GetFirstOrDefaultAsync(l => l.QuizId == quizId && l.UserId == userId);
            return new LikedDto
            {
                IsLiked = likes != null
            };
        }
        public async Task<LikeQuiz> LikeQuizAsync(Guid quizId, string userId)
        {
            var quiz = await _unitOfWork.Quiz.GetFirstOrDefaultAsync(q => q.Id == quizId);
            if (quiz == null) 
                throw new KeyNotFoundException("Quiz non trovato");
            var existingLike = await _unitOfWork.LikeQuiz
                .GetFirstOrDefaultAsync(l => l.QuizId == quizId && l.UserId == userId);
            if (existingLike != null)
                throw new LikeStatusException("the quiz has already been liked");
            var like = new LikeQuiz
            {
                QuizId = quizId,
                UserId = userId
            };
            await _unitOfWork.LikeQuiz.AddAsync(like);
            await _unitOfWork.SaveAsync();
            return like;
        }
        public async Task UnlikeQuizAsync(Guid quizId, string userId)
        {
            var existingLike = await _unitOfWork.LikeQuiz
                .GetFirstOrDefaultAsync(l => l.QuizId == quizId && l.UserId == userId);
            if (existingLike == null)
                throw new LikeStatusException("you have not liked this quiz");
            _unitOfWork.LikeQuiz.Remove(existingLike);
            await _unitOfWork.SaveAsync();
        }   
        public async Task<IEnumerable<Quiz>> GetLikedQuizzesAsync(string userId)
        {
            var allUserLikes = await _unitOfWork.LikeQuiz.GetAllAsync(qa => qa.UserId == userId, "Quiz");
            return allUserLikes
                .Select(l => l.Quiz);
        }
    }
}
