// Services/ServiceService.cs
using Microsoft.EntityFrameworkCore;
using SkillBridge.Data;
using SkillBridge.Interfaces;
using SkillBridge.Models.DTOs.Services;
using SkillBridge.Models.Entities;
using SkillBridge.Models.Enums;

namespace SkillBridge.Services
{
    public class ServiceService : IServiceService
    {
        private readonly AppDbContext _context;

        public ServiceService(AppDbContext context)
        {
            _context = context;
        }

        // ==================== Provider Methods ====================

        public async Task<ServiceDetailsDto> CreateServiceAsync(int providerId, CreateServiceDto dto)
        {
            var service = new Service
            {
                Title = dto.Title,
                Description = dto.Description,
                CategoryId = dto.CategoryId,
                Price = dto.Price,
                DeliveryTimeInDays = dto.DeliveryTimeInDays,
                ProviderId = providerId,
                Status = ServiceStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            // Add Portfolio Images
            if (dto.PortfolioImageUrls != null && dto.PortfolioImageUrls.Any())
            {
                var images = dto.PortfolioImageUrls.Select(url => new ServiceImage
                {
                    ServiceId = service.serviceId,
                    ImageUrl = url
                }).ToList();

                _context.ServiceImages.AddRange(images);
                await _context.SaveChangesAsync();
            }

            var result = await GetServiceDetailsAsync(service.serviceId);
            return result!;
        }

        public async Task<ServiceDetailsDto?> UpdateServiceAsync(int providerId, int serviceId, UpdateServiceDto dto)
        {
            var service = await _context.Services
                .Include(s => s.Images)
                .FirstOrDefaultAsync(s => s.serviceId == serviceId && s.ProviderId == providerId);

            if (service == null) return null;

            // Update fields if provided
            if (!string.IsNullOrEmpty(dto.Title))
                service.Title = dto.Title;

            if (!string.IsNullOrEmpty(dto.Description))
                service.Description = dto.Description;

            if (dto.CategoryId.HasValue)
                service.CategoryId = dto.CategoryId.Value;

            if (dto.Price.HasValue)
                service.Price = dto.Price.Value;

            if (dto.DeliveryTimeInDays.HasValue)
                service.DeliveryTimeInDays = dto.DeliveryTimeInDays.Value;

            // Reset to pending after update
            service.Status = ServiceStatus.Pending;
            service.UpdatedAt = DateTime.UtcNow;

            // Update images if provided
            if (dto.PortfolioImageUrls != null)
            {
                // Remove old images
                _context.ServiceImages.RemoveRange(service.Images);

                // Add new images
                var newImages = dto.PortfolioImageUrls.Select(url => new ServiceImage
                {
                    ServiceId = service.serviceId,
                    ImageUrl = url
                }).ToList();

                _context.ServiceImages.AddRange(newImages);
            }

            await _context.SaveChangesAsync();
            return await GetServiceDetailsAsync(service.serviceId);
        }

        public async Task<bool> DeleteServiceAsync(int providerId, int serviceId)
        {
            var service = await _context.Services
                .Include(s => s.Images)
                .FirstOrDefaultAsync(s => s.serviceId == serviceId && s.ProviderId == providerId);

            if (service == null) return false;

            // Remove images first
            _context.ServiceImages.RemoveRange(service.Images);
            _context.Services.Remove(service);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<ServiceListDto>> GetMyServicesAsync(int providerId)
        {
            return await _context.Services
                .Where(s => s.ProviderId == providerId)
                .Include(s => s.Provider)
                .Include(s => s.Category)
                .Include(s => s.Images)
                .Include(s => s.Ratings)
                .Select(s => new ServiceListDto
                {
                    Id = s.serviceId,
                    Title = s.Title,
                    ProviderName = s.Provider.FullName,
                    CategoryName = s.Category.Name,
                    Price = s.Price,
                    DeliveryTimeInDays = s.DeliveryTimeInDays,
                    AverageRating = s.Ratings.Any() ? s.Ratings.Average(r => r.RatingValue) : 0,
                    ThumbnailUrl = s.Images.Select(i => i.ImageUrl).FirstOrDefault(),
                    Status = s.Status.ToString()
                })
                .ToListAsync();
        }

        // ==================== Public Methods ====================

        public async Task<List<ServiceListDto>> GetApprovedServicesAsync(ServiceFilterDto filter)
        {
            var query = _context.Services
                .Where(s => s.Status == ServiceStatus.Approved)
                .Include(s => s.Provider)
                .Include(s => s.Category)
                .Include(s => s.Images)
                .Include(s => s.Ratings)
                .AsQueryable();

            // Search by title or description
            if (!string.IsNullOrEmpty(filter.Search))
            {
                query = query.Where(s =>
                    s.Title.Contains(filter.Search) ||
                    s.Description.Contains(filter.Search));
            }

            // Filter by category
            if (filter.CategoryId.HasValue)
            {
                query = query.Where(s => s.CategoryId == filter.CategoryId.Value);
            }

            // Filter by price range
            if (filter.MinPrice.HasValue)
            {
                query = query.Where(s => s.Price >= filter.MinPrice.Value);
            }

            if (filter.MaxPrice.HasValue)
            {
                query = query.Where(s => s.Price <= filter.MaxPrice.Value);
            }

            // Project to DTO
            var result = query.Select(s => new ServiceListDto
            {
                Id = s.serviceId,
                Title = s.Title,
                ProviderName = s.Provider.FullName,
                CategoryName = s.Category.Name,
                Price = s.Price,
                DeliveryTimeInDays = s.DeliveryTimeInDays,
                AverageRating = s.Ratings.Any() ? s.Ratings.Average(r => r.RatingValue) : 0,
                ThumbnailUrl = s.Images.Select(i => i.ImageUrl).FirstOrDefault(),
                Status = s.Status.ToString()
            });

            // Filter by rating (after projection)
            if (filter.MinRating.HasValue)
            {
                result = result.Where(s => s.AverageRating >= filter.MinRating.Value);
            }

            // Sorting
            result = filter.SortBy?.ToLower() switch
            {
                "price" => filter.IsDescending
                    ? result.OrderByDescending(s => s.Price)
                    : result.OrderBy(s => s.Price),
                "rating" => filter.IsDescending
                    ? result.OrderByDescending(s => s.AverageRating)
                    : result.OrderBy(s => s.AverageRating),
                _ => result.OrderByDescending(s => s.Id) // newest first
            };

            // Pagination
            var paginatedResult = await result
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return paginatedResult;
        }

        public async Task<ServiceDetailsDto?> GetServiceDetailsAsync(int serviceId)
        {
            var service = await _context.Services
                .Include(s => s.Provider)
                .Include(s => s.Category)
                .Include(s => s.Images)
                .Include(s => s.Ratings)
                .FirstOrDefaultAsync(s => s.serviceId == serviceId);

            if (service == null) return null;

            return new ServiceDetailsDto
            {
                Id = service.serviceId,
                Title = service.Title,
                Description = service.Description,
                ProviderName = service.Provider.FullName,
                ProviderId = service.ProviderId,
                CategoryName = service.Category.Name,
                CategoryId = service.CategoryId,
                Price = service.Price,
                DeliveryTimeInDays = service.DeliveryTimeInDays,
                AverageRating = service.Ratings.Any()
                    ? service.Ratings.Average(r => r.RatingValue) : 0,
                TotalRatings = service.Ratings.Count,
                PortfolioImageUrls = service.Images.Select(i => i.ImageUrl).ToList(),
                Status = service.Status.ToString(),
                CreatedAt = service.CreatedAt
            };
        }
    }
}