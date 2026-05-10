// Models/DTOs/Services/ServiceDetailsDto.cs
namespace SkillBridge.Models.DTOs.Services
{
    public class ServiceDetailsDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ProviderName { get; set; } = string.Empty;
        public int ProviderId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public decimal Price { get; set; }
        public int DeliveryTimeInDays { get; set; }
        public double AverageRating { get; set; }
        public int TotalRatings { get; set; }
        public List<string> PortfolioImageUrls { get; set; } = new();
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}