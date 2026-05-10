using Helpers;
using Microsoft.EntityFrameworkCore;
using SkillBridge.Data;
using SkillBridge.Helpers;
using SkillBridge.Interfaces;
using SkillBridge.Models.DTOs.Auth;
using SkillBridge.Models.Entities;
using SkillBridge.Models.Enums;

namespace SkillBridge.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly JwtHelper _jwtHelper;

        public AuthService(AppDbContext context, JwtHelper jwtHelper)
        {
            _context = context;
            _jwtHelper = jwtHelper;
        }

        public async Task<AuthResponseDto?> RegisterAsync(RegisterDto dto)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (existingUser != null)
                return null;

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = PasswordHasher.Hash(dto.Password),
                Phone = dto.Phone,
                Role = dto.Role,
                Status = dto.Role == UserRole.Provider
                    ? UserStatus.Pending
                    : UserStatus.Active,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = _jwtHelper.GenerateToken(user);

            return new AuthResponseDto
            {
                Token = token,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role.ToString()
            };
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == dto.Email);

            if (user == null)
                return null;

            var passwordValid = PasswordHasher.Verify(dto.Password, user.PasswordHash);

            if (!passwordValid)
                return null;

            if (user.Role == UserRole.Provider && user.Status != UserStatus.Approved && user.Status != UserStatus.Active)
                return null;

            var token = _jwtHelper.GenerateToken(user);

            return new AuthResponseDto
            {
                Token = token,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role.ToString()
            };
        }

        public async Task<User?> GetCurrentUserAsync(int userId)
        {
            return await _context.Users.FirstOrDefaultAsync(x => x.Id == userId);
        }

        public async Task<bool> LogoutAsync(string token)
        {
            if (string.IsNullOrEmpty(token))
                return false;

            var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();

            var jwtToken = handler.ReadJwtToken(token);

            var expiry = jwtToken.ValidTo;

            var blacklistedToken = new BlacklistedToken
            {
                Token = token,
                ExpireAt = expiry
            };

            _context.Set<BlacklistedToken>().Add(blacklistedToken);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
