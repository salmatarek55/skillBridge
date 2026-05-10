namespace SkillBridge.Models.DTOs.Messages
{
    public class SendMessageDto
    {
        public int RequestId { get; set; }
        public int ReceiverId { get; set; }
        public string MessageText { get; set; } = string.Empty;
    }
}