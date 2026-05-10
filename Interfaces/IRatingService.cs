using SkillBridge.Helpers;
using SkillBridge.Models.DTOs.Ratings;

namespace SkillBridge.Interfaces
{
    public interface IRatingService
    {
        Task<ApiResponse<string>> SubmitRatingAsync(int clientId, CreateRatingDto dto);
        Task<ApiResponse<List<RatingDto>>> GetServiceRatingsAsync(int serviceId);
    }
}