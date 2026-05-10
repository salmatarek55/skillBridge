// Models/DTOs/Services/ServiceFilterDto.cs
namespace SkillBridge.Models.DTOs.Services
{
    public class ServiceFilterDto
    {
        public string? Search { get; set; }
        public int? CategoryId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public double? MinRating { get; set; }
        public string? SortBy { get; set; }        // "price", "rating", "newest"
        public bool IsDescending { get; set; } = false;
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}