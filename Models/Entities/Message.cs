using SkillBridge.Models.Entities;
namespace SkillBridge.Models.Entities
{
    public class Message
    {
        public int Id { get; set; }

        public int RequestId { get; set; }
        public ServiceRequest Request { get; set; } = null!;

        public int SenderId { get; set; }
        public User Sender { get; set; } = null!;

        public int ReceiverId { get; set; }
        public User Receiver { get; set; } = null!;

        public string MessageText { get; set; } = string.Empty;

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}