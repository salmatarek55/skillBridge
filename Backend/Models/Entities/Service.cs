// Models/Entities/Service.cs
using SkillBridge.Models.Enums;

namespace SkillBridge.Models.Entities
{
    public class Service
    {
        public int serviceId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }

        public int CategoryId { get; set; }          
        public Category Category { get; set; } = null!; 

        public int DeliveryTimeInDays { get; set; }
        public ServiceStatus Status { get; set; } = ServiceStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Foreign Keys
        public int ProviderId { get; set; }

        // Navigation Properties
        public User Provider { get; set; } = null!;
        public List<ServiceImage> Images { get; set; } = new();
        public List<Rating> Ratings { get; set; } = new();
        public List<ServiceRequest> Requests { get; set; } = new();
    }
}