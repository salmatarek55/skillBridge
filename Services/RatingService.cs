using Microsoft.EntityFrameworkCore;
using SkillBridge.Data;
using SkillBridge.Helpers;
using SkillBridge.Interfaces;
using SkillBridge.Models.DTOs.Ratings;
using SkillBridge.Models.Entities;
using SkillBridge.Models.Enums;

namespace SkillBridge.Services
{
    public class RatingService : IRatingService
    {
        private readonly AppDbContext _db;

        public RatingService(AppDbContext db) => _db = db;


        public async Task<ApiResponse<string>> SubmitRatingAsync(
            int clientId,
            CreateRatingDto dto)
        {
            var request = await _db.ServiceRequests
                .Include(x => x.Service)
                .Include(x => x.Provider)
                .FirstOrDefaultAsync(x => x.Id == dto.RequestId);

            if (request == null)
            {
                return ApiResponse<string>.Fail("Request not found.");
            }

            var rating = new Rating
            {
                RequestId = request.Id,
                ServiceId = request.ServiceId,
                ClientId = clientId,
                ProviderId = request.ProviderId, 
                RatingValue = dto.RatingValue,
                ReviewText = dto.ReviewText,
                CreatedAt = DateTime.UtcNow
            };

            _db.Ratings.Add(rating);

            await _db.SaveChangesAsync();

            return ApiResponse<string>.Ok(
                "Rating submitted successfully.");
        }

        public async Task<ApiResponse<List<RatingDto>>> GetServiceRatingsAsync(
            int serviceId)
        {
            var ratings = await _db.Ratings
                .Include(x => x.Client)
                .Include(x => x.Service)
                .Where(x => x.ServiceId == serviceId)
                .Select(x => new RatingDto
                {
                    Id = x.Id,
                    ServiceTitle = x.Service.Title,
                    ClientName = x.Client.FullName,
                    RatingValue = x.RatingValue,
                    ReviewText = x.ReviewText,
                    CreatedAt = x.CreatedAt
                })
                .ToListAsync();

            return ApiResponse<List<RatingDto>>.Ok(ratings);
        }



        public async Task<ApiResponse<string>> CreateRatingAsync(int clientId, CreateRatingDto dto)
        {
            // 1. Fetch the request and include the Service to check duration
            var request = await _db.ServiceRequests
                .Include(r => r.Service)
                .FirstOrDefaultAsync(r => r.Id == dto.RequestId && r.ClientId == clientId);

            // 2. Check if the request exists and belongs to the current client
            if (request == null)
                return ApiResponse<string>.Fail("Service request not found or access denied.");

            // 3. Logic Check: Has the service been completed OR has the duration expired?
            var durationExpired = DateTime.UtcNow > request.CreatedAt.AddDays(request.Service.DeliveryTimeInDays);

            if (request.Status != RequestStatus.Completed && !durationExpired)
            {
                return ApiResponse<string>.Fail("Ratings can only be submitted after the service is marked as completed or the delivery duration has ended.");
            }

            // 4. Prevent duplicate ratings for the same service by the same client
            var existingRating = await _db.Ratings.AnyAsync(r => r.ServiceId == request.ServiceId && r.ClientId == clientId);
            if (existingRating)
                return ApiResponse<string>.Fail("You have already submitted a rating for this service.");

            // 5. Map and save the new rating
            var rating = new Rating
            {
                ServiceId = request.ServiceId,
                ClientId = clientId,
                RatingValue = dto.RatingValue,
                ReviewText = dto.ReviewText,
                CreatedAt = DateTime.UtcNow
            };



            _db.Ratings.Add(rating);
            await _db.SaveChangesAsync();

            return ApiResponse<string>.Ok("Your rating has been submitted successfully.");
        }
    }
}