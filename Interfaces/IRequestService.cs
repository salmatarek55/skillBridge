using SkillBridge.Helpers;
using SkillBridge.Models.DTOs.Requests;

namespace SkillBridge.Interfaces
{
    public interface IRequestService
    {
        Task<ApiResponse<RequestResponseDto>> CreateRequestAsync(int clientId, CreateRequestDto dto);
        Task<ApiResponse<List<RequestResponseDto>>> GetMyRequestsAsync(int userId, string role);
        Task<ApiResponse<string>> AcceptRequestAsync(int providerId, int requestId);
        Task<ApiResponse<string>> RejectRequestAsync(int providerId, int requestId);
        Task<ApiResponse<string>> MarkCompletedAsync(int providerId, int requestId);
        Task<ApiResponse<string>> CancelRequestAsync(int clientId, int requestId);
    }
}