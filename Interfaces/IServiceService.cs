using SkillBridge.Models.DTOs.Services;
namespace SkillBridge.Interfaces
{
    public interface IServiceService
    {
        // Provider
        Task<ServiceDetailsDto> CreateServiceAsync(int providerId, CreateServiceDto dto);
        Task<ServiceDetailsDto?> UpdateServiceAsync(int providerId, int serviceId, UpdateServiceDto dto);
        Task<bool> DeleteServiceAsync(int providerId, int serviceId);
        Task<List<ServiceListDto>> GetMyServicesAsync(int providerId);

        // Public
        Task<List<ServiceListDto>> GetApprovedServicesAsync(ServiceFilterDto filter);
        Task<ServiceDetailsDto?> GetServiceDetailsAsync(int serviceId);
    }
}