namespace SkillBridge.Models.DTOs.Messages
{
    public class MessageDto
    {
        public int Id { get; set; }
        public int RequestId { get; set; }
        public int SenderId { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public int ReceiverId { get; set; }
        public string ReceiverName { get; set; } = string.Empty;
        public string MessageText { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}