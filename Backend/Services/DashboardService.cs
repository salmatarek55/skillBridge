using Microsoft.EntityFrameworkCore;
using SkillBridge.Data;
using SkillBridge.Helpers;
using SkillBridge.Interfaces;
using SkillBridge.Models.DTOs.Dashboard;
using SkillBridge.Models.Enums;

namespace SkillBridge.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _db;

        public DashboardService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<ApiResponse<ProviderDashboardDto>> GetDashboardAsync(int providerId)
        {
            var totalEarnings = await _db.ServiceRequests
                .Where(r => r.ProviderId == providerId && r.Status == RequestStatus.Completed)
                .SumAsync(r => r.AgreedPrice);
            var activeOrders = await _db.ServiceRequests
                .Include(r => r.Service)
                .Include(r => r.Client)
                .Where(r => r.ProviderId == providerId && r.Status == RequestStatus.Accepted)
                .Select(r => new ActiveOrderDto
                {
                    RequestId = r.Id,
                    ServiceTitle = r.Service.Title,
                    ClientName = r.Client.FullName,
                    AgreedPrice = r.AgreedPrice,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();

            var result = new ProviderDashboardDto
            {
                TotalEarnings = totalEarnings,
                ActiveOrdersCount = activeOrders.Count,
                ActiveOrders = activeOrders
            };

            return ApiResponse<ProviderDashboardDto>.Ok(result);
        }
    }
}