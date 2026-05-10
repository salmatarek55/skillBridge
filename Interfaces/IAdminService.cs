using SkillBridge.Helpers;
using SkillBridge.Models.DTOs.Admin;
using SkillBridge.Models.Entities;

namespace SkillBridge.Interfaces
{
    public interface IAdminService
    {
        Task<List<User>> GetPendingProvidersAsync();

        Task<ApiResponse<string>> ApproveProviderAsync(int providerId);

        Task<ApiResponse<string>> RejectProviderAsync(int providerId);

        Task<List<Service>> GetPendingServicesAsync();

        Task<ApiResponse<string>> ApproveServiceAsync(int serviceId);

        Task<ApiResponse<string>> RejectServiceAsync(int serviceId);

        Task<ApiResponse<List<UserDto>>> GetAllUsersAsync();
    }
}