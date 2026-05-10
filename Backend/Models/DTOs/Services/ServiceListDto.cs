// Models/DTOs/Services/ServiceListDto.cs
namespace SkillBridge.Models.DTOs.Services
{
    public class ServiceListDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string ProviderName { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int DeliveryTimeInDays { get; set; }
        public double AverageRating { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}