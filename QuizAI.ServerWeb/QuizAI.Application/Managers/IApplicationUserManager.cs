using QuizAI.Model.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizAI.Application.Managers
{
    public interface IApplicationUserManager
    {
        Task<UserProfileDTO> GetProfileAsync(string userId, string email, bool isCurrentUser);
        Task<SettingsDto> GetSettingsAsync(string userId);
    }
}
