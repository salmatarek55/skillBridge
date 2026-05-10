// Models/DTOs/Services/CreateServiceDto.cs
using System.ComponentModel.DataAnnotations;

namespace SkillBridge.Models.DTOs.Services
{
    public class CreateServiceDto
    {
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public int CategoryId { get; set; }

        [Required]
        [Range(1, 100000)]
        public decimal Price { get; set; }

        [Required]
        [Range(1, 365)]
        public int DeliveryTimeInDays { get; set; }

        public List<string>? PortfolioImageUrls { get; set; }
    }
}