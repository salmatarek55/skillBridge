using Microsoft.EntityFrameworkCore;
using SkillBridge.Data;
using SkillBridge.Helpers;
using SkillBridge.Interfaces;
using SkillBridge.Models.DTOs.Admin;
using SkillBridge.Models.Entities;
using SkillBridge.Models.Enums;

namespace SkillBridge.Services
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _context;

        public AdminService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<User>> GetPendingProvidersAsync()
        {
            return await _context.Users
                .Where(x => x.Role == UserRole.Provider && x.Status == UserStatus.Pending)
                .ToListAsync();
        }

        public async Task<ApiResponse<string>> ApproveProviderAsync(int providerId)
        {
            var provider = await _context.Users
                .FirstOrDefaultAsync(x => x.Id == providerId && x.Role == UserRole.Provider);

            if (provider == null)
                return ApiResponse<string>.Fail("Provider not found");

            provider.Status = UserStatus.Approved;
            provider.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return ApiResponse<string>.Ok("Provider approved successfully");
        }
        public async Task<ApiResponse<string>> RejectProviderAsync(int providerId)
        {
            var provider = await _context.Users
                .FirstOrDefaultAsync(x => x.Id == providerId && x.Role == UserRole.Provider);

            if (provider == null)
                return ApiResponse<string>.Fail("Provider not found");

            provider.Status = UserStatus.Rejected;
            provider.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return ApiResponse<string>.Ok("Provider rejected successfully");
        }

        public async Task<List<Service>> GetPendingServicesAsync()
        {
            return await _context.Services
                .Include(x => x.Provider)
                .Where(x => x.Status == ServiceStatus.Pending)
                .ToListAsync();
        }

        public async Task<ApiResponse<List<UserDto>>> GetAllUsersAsync()
        {
            var users = await _context.Users
                .Where(u => u.Role != UserRole.Admin && u.Status != UserStatus.Rejected)
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    Phone = u.Phone,
                    Role = u.Role.ToString(),
                    Status = u.Status.ToString(),
                    CreatedAt = u.CreatedAt
                }).ToListAsync();

            return ApiResponse<List<UserDto>>.Ok(users);
        }
        public async Task<ApiResponse<string>> ApproveServiceAsync(int serviceId)
        {
            var service = await _context.Services
                .FirstOrDefaultAsync(x => x.serviceId == serviceId);

            if (service == null)
                return ApiResponse<string>.Fail("Service not found");

            service.Status = ServiceStatus.Approved;
            service.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return ApiResponse<string>.Ok("Service approved successfully");
        }

        public async Task<ApiResponse<string>> RejectServiceAsync(int serviceId)
        {
            var service = await _context.Services
                .FirstOrDefaultAsync(x => x.serviceId == serviceId);

            if (service == null)
                return ApiResponse<string>.Fail("Service not found");

            service.Status = ServiceStatus.Rejected;
            service.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return ApiResponse<string>.Ok("Service rejected successfully");
        }
    }
}