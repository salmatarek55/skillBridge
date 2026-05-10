// Models/DTOs/Services/UpdateServiceDto.cs
using System.ComponentModel.DataAnnotations;

namespace SkillBridge.Models.DTOs.Services
{
    public class UpdateServiceDto
    {
        [MaxLength(100)]
        public string? Title { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        public int? CategoryId { get; set; }

        [Range(1, 100000)]
        public decimal? Price { get; set; }

        [Range(1, 365)]
        public int? DeliveryTimeInDays { get; set; }

        public List<string>? PortfolioImageUrls { get; set; }
    }
}