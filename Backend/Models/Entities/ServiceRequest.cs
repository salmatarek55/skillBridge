using SkillBridge.Models.Enums; 

namespace SkillBridge.Models.Entities
{
    public class ServiceRequest
    {
        public int Id { get; set; }

        public int ServiceId { get; set; }
        public Service Service { get; set; } = null!;

        public int ClientId { get; set; }
        public User Client { get; set; } = null!;

        public int ProviderId { get; set; }
        public User Provider { get; set; } = null!;

        public string Message { get; set; } = string.Empty;

        public RequestStatus Status { get; set; } = RequestStatus.Pending;

        public decimal AgreedPrice { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? CompletedAt { get; set; }

        // Navigation Properties
        public ICollection<Message> Messages { get; set; } = new List<Message>();

        public Rating? Rating { get; set; }
    }
}