using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using SkillBridge.Data;
using SkillBridge.Models.Entities;
using SkillBridge.Models.Enums;
using System.Security.Claims;

namespace SkillBridge.GraphQL.Mutations
{
    public class ServiceMutation
    {
        private readonly AppDbContext _db;
        private readonly IMemoryCache _cache;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ServiceMutation(AppDbContext db, IMemoryCache cache, IHttpContextAccessor httpContextAccessor)
        {
            _db = db;
            _cache = cache;
            _httpContextAccessor = httpContextAccessor;
        }

        // Write-Around Strategy - Provider فقط
        public async Task<Service> CreateServiceAsync(
            string title,
            string description,
            int categoryId,
            decimal price,
            int deliveryTimeDays)
        {
            // تأكد إن الـ user Provider
            var user = _httpContextAccessor.HttpContext?.User;
            var role = user?.FindFirstValue(ClaimTypes.Role);

            if (role != "Provider")
                throw new UnauthorizedAccessException("Only Service Providers can create services");

            var providerId = int.Parse(user!.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var service = new Service
            {
                Title = title,
                Description = description,
                CategoryId = categoryId,
                Price = price,
                DeliveryTimeInDays = deliveryTimeDays,
                ProviderId = providerId,
                Status = ServiceStatus.Pending
            };

            // Write-Around: اكتب في DB بس
            _db.Services.Add(service);
            await _db.SaveChangesAsync();

            // امسح الـ Cache القديم
            _cache.Remove("all_services");

            return service;
        }
    }
}