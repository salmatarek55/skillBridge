namespace SkillBridge.Models.DTOs.Requests
{
    public class RequestResponseDto
    {
        public int Id { get; set; }
        public int ServiceId { get; set; }
        public string ServiceTitle { get; set; } = string.Empty;
        public string ClientName { get; set; } = string.Empty;
        public string ProviderName { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal AgreedPrice { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}