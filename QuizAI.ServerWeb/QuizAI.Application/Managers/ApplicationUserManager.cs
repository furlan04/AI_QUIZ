using QuizAI.Data.Repository.IRepository;
using QuizAI.Model.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizAI.Application.Managers
{
    public class ApplicationUserManager : IApplicationUserManager
    {
        private readonly IUnitOfWork _unitOfWork;
        public ApplicationUserManager(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<UserProfileDTO> GetProfileAsync(string targetUserId, string email, bool isCurrentUser)
        {
            throw new NotImplementedException();
        }
        public Task<SettingsDto> GetSettingsAsync(string userId)
        {
            throw new NotImplementedException();
        }
    }
}
