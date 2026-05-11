using Microsoft.EntityFrameworkCore;
using SkillBridge.Data;
using SkillBridge.Helpers;
using SkillBridge.Interfaces;
using SkillBridge.Models.DTOs.Requests;
using SkillBridge.Models.Entities;
using SkillBridge.Models.Enums;

namespace SkillBridge.Services
{
    public class RequestService : IRequestService
    {
        private readonly AppDbContext _db;

        public RequestService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<ApiResponse<RequestResponseDto>> CreateRequestAsync(int clientId, CreateRequestDto dto)
        {
            var service = await _db.Services
                .FirstOrDefaultAsync(s => s.serviceId == dto.ServiceId && s.Status == ServiceStatus.Approved);

            if (service == null)
                return ApiResponse<RequestResponseDto>.Fail("Service not found or has not been approved by Admin yet.");

            if (service.ProviderId == clientId)
                return ApiResponse<RequestResponseDto>.Fail("You cannot request your own service.");

            var request = new ServiceRequest
            {
                ServiceId = dto.ServiceId,
                ClientId = clientId,
                ProviderId = service.ProviderId,
                Message = dto.Message,
                AgreedPrice = dto.AgreedPrice,
                Status = RequestStatus.Pending,
                CreatedAt = DateTime.UtcNow // Ensure CreatedAt is set
            };

            _db.ServiceRequests.Add(request);
            await _db.SaveChangesAsync();

            var result = await GetRequestDtoAsync(request.Id);
            return ApiResponse<RequestResponseDto>.Ok(result!, "Service request sent successfully.");
        }

        public async Task<ApiResponse<List<RequestResponseDto>>> GetMyRequestsAsync(int userId, string role)
        {
            IQueryable<ServiceRequest> query = _db.ServiceRequests
                .Include(r => r.Service)
                .Include(r => r.Client)
                .Include(r => r.Provider);

            if (role == "Client")
                query = query.Where(r => r.ClientId == userId);
            else
                query = query.Where(r => r.ProviderId == userId);

            var requests = await query
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new RequestResponseDto
{
    Id = r.Id,
    ServiceId = r.ServiceId,
    ServiceTitle = r.Service.Title,
    ClientId = r.ClientId,       
    ClientName = r.Client.FullName,
    ProviderId = r.ProviderId, 
    ProviderName = r.Provider.FullName,
    Message = r.Message,
    Status = r.Status.ToString(),
    AgreedPrice = r.AgreedPrice,
    CreatedAt = r.CreatedAt,
    CompletedAt = r.CompletedAt
}).ToListAsync();

            return ApiResponse<List<RequestResponseDto>>.Ok(requests);
        }
        public async Task<ApiResponse<string>> CancelRequestAsync(int clientId, int requestId)
        {
            var request = await _db.ServiceRequests
                .FirstOrDefaultAsync(r => r.Id == requestId && r.ClientId == clientId);

            if (request == null)
                return ApiResponse<string>.Fail("Request not found or you are not authorized to cancel it.");

            if (request.Status != RequestStatus.Pending)
                return ApiResponse<string>.Fail("Only pending requests can be cancelled.");

            request.Status = RequestStatus.Cancelled;
            await _db.SaveChangesAsync();

            return ApiResponse<string>.Ok("Request cancelled successfully.");
        }
        public async Task<ApiResponse<string>> AcceptRequestAsync(int providerId, int requestId)
        {
            var request = await _db.ServiceRequests
                .FirstOrDefaultAsync(r => r.Id == requestId && r.ProviderId == providerId);

            if (request == null)
                return ApiResponse<string>.Fail("Request not found or you are not authorized to accept it.");

            if (request.Status != RequestStatus.Pending)
                return ApiResponse<string>.Fail("Only pending requests can be accepted.");

            request.Status = RequestStatus.Accepted;
            await _db.SaveChangesAsync();

            return ApiResponse<string>.Ok("Request accepted successfully.");
        }

        public async Task<ApiResponse<string>> RejectRequestAsync(int providerId, int requestId)
        {
            var request = await _db.ServiceRequests
                .FirstOrDefaultAsync(r => r.Id == requestId && r.ProviderId == providerId);

            if (request == null)
                return ApiResponse<string>.Fail("Request not found or you are not authorized to reject it.");

            if (request.Status != RequestStatus.Pending)
                return ApiResponse<string>.Fail("Only pending requests can be rejected.");

            request.Status = RequestStatus.Rejected;
            await _db.SaveChangesAsync();

            return ApiResponse<string>.Ok("Request rejected.");
        }

        public async Task<ApiResponse<string>> MarkCompletedAsync(int providerId, int requestId)
        {
            // Debug: Check if the request exists at all
            var request = await _db.ServiceRequests
                .FirstOrDefaultAsync(r => r.Id == requestId && r.ProviderId == providerId);

            if (request == null)
                return ApiResponse<string>.Fail("Request not found. Make sure you are the provider of this service.");

            // Standard Check: Must be Accepted to move to Completed
            if (request.Status != RequestStatus.Accepted)
            {
                return ApiResponse<string>.Fail($"Request status must be 'Accepted' to mark as completed. Current status: {request.Status}");
            }

            request.Status = RequestStatus.Completed;
            request.CompletedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return ApiResponse<string>.Ok("The service has been successfully marked as completed.");
        }

        private async Task<RequestResponseDto?> GetRequestDtoAsync(int requestId)
        {
            return await _db.ServiceRequests
                .Include(r => r.Service)
                .Include(r => r.Client)
                .Include(r => r.Provider)
                .Where(r => r.Id == requestId)
               .Select(r => new RequestResponseDto
{
    Id = r.Id,
    ServiceId = r.ServiceId,
    ServiceTitle = r.Service.Title,
    ClientId = r.ClientId,       
    ClientName = r.Client.FullName,
    ProviderId = r.ProviderId,   
    ProviderName = r.Provider.FullName,
    Message = r.Message,
    Status = r.Status.ToString(),
    AgreedPrice = r.AgreedPrice,
    CreatedAt = r.CreatedAt,
    CompletedAt = r.CompletedAt
}).FirstOrDefaultAsync();
        }
    }

}