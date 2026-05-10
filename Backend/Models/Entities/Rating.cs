using SkillBridge.Models.Entities;

namespace SkillBridge.Models.Entities
{
    public class Rating
    {
        public int Id { get; set; }

        public int RequestId { get; set; }
        public ServiceRequest Request { get; set; } = null!;

        public int ServiceId { get; set; }
        public Service Service { get; set; } = null!;

        public int ClientId { get; set; }
        public User Client { get; set; } = null!;

        public int ProviderId { get; set; }
        public User Provider { get; set; } = null!;

        public int RatingValue { get; set; }

        public string? ReviewText { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}