using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillBridge.Interfaces;
using SkillBridge.Models.DTOs.Ratings;
using System.Security.Claims;

namespace SkillBridge.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RatingsController : ControllerBase
    {
        private readonly IRatingService _ratingService;

        public RatingsController(IRatingService ratingService)
        {
            _ratingService = ratingService;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // POST /api/Ratings — Client يبعت rating
        [HttpPost]
        [Authorize(Roles = "Client")]
        public async Task<IActionResult> SubmitRating([FromBody] CreateRatingDto dto)
        {
            var result = await _ratingService.SubmitRatingAsync(GetUserId(), dto);
            return result.Success ? Ok(result) : BadRequest(result);
        }

        // GET /api/Ratings/service/{serviceId} — ratings لـ service معينة
        [HttpGet("service/{serviceId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetServiceRatings(int serviceId)
        {
            var result = await _ratingService.GetServiceRatingsAsync(serviceId);
            return Ok(result);
        }
    }
}