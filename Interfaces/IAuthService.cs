using SkillBridge.Models.DTOs.Auth;
using SkillBridge.Models.Entities;

namespace SkillBridge.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto?> LoginAsync(LoginDto dto);
        Task<User?> GetCurrentUserAsync(int userId);

        Task<bool> LogoutAsync(string token);
    }
}