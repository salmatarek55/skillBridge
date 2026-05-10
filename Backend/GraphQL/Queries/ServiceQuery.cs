using Microsoft.Extensions.Caching.Memory;
using SkillBridge.Data;
using SkillBridge.Models.Entities;
using SkillBridge.Models.Enums;
using Microsoft.EntityFrameworkCore;
using SkillBridge.Models.DTOs.Dashboard;

namespace SkillBridge.GraphQL.Queries
{
    public class ServiceQuery
    {
        // Cache-Aside Strategy
        public async Task<List<Service>> GetServicesAsync(
            AppDbContext db,
            IMemoryCache cache)
        {
            const string cacheKey = "all_services";

            if (cache.TryGetValue(cacheKey, out List<Service>? cached))
                return cached!;

            var services = await db.Services
                .Include(s => s.Provider)
                .Include(s => s.Images)
                .Where(s => s.Status == ServiceStatus.Approved)
                .ToListAsync();

            cache.Set(cacheKey, services, TimeSpan.FromMinutes(10));

            return services;
        }

        public async Task<Service?> GetServiceByIdAsync(
            int id,
            AppDbContext db,
            IMemoryCache cache)
        {
            var cacheKey = $"service_{id}";

            if (cache.TryGetValue(cacheKey, out Service? cached))
                return cached;

            var service = await db.Services
                .Include(s => s.Provider)
                .Include(s => s.Images)
                .FirstOrDefaultAsync(s => s.serviceId == id);

            if (service != null)
                cache.Set(cacheKey, service, TimeSpan.FromMinutes(10));

            return service;
        }
        public CacheStatsDto GetCacheStats(IMemoryCache cache)
        {
            var isCached = cache.TryGetValue("all_services", out _);

            return new CacheStatsDto
            {
                IsServicesCached = isCached,
                Message = isCached
                    ? " Cache is ACTIVE - Data served from Cache"
                    : " Cache is EMPTY - Next request will go to DB",
                CheckedAt = DateTime.UtcNow
            };
        }
    }

}