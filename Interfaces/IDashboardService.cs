using SkillBridge.Helpers;
using SkillBridge.Models.DTOs.Dashboard;

namespace SkillBridge.Interfaces
{
    public interface IDashboardService
    {
        Task<ApiResponse<ProviderDashboardDto>> GetDashboardAsync(int providerId);
    }
}