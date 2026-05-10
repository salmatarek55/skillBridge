using SkillBridge.Models.Enums; 
namespace SkillBridge.Models.Entities
{
    public class User
    {
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public string? Phone { get; set; }

        public string? ProfileImage { get; set; }

        public UserRole Role { get; set; }

        public UserStatus Status { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation Properties
        public ICollection<Service> Services { get; set; } = new List<Service>();

        public ICollection<ServiceRequest> ClientRequests { get; set; } = new List<ServiceRequest>();

        public ICollection<ServiceRequest> ProviderRequests { get; set; } = new List<ServiceRequest>();

        public ICollection<Message> SentMessages { get; set; } = new List<Message>();

        public ICollection<Message> ReceivedMessages { get; set; } = new List<Message>();

        public ICollection<Rating> GivenRatings { get; set; } = new List<Rating>();

        public ICollection<Rating> ReceivedRatings { get; set; } = new List<Rating>();
    }
}