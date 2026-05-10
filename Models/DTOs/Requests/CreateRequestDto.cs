namespace SkillBridge.Models.DTOs.Requests
{
    public class CreateRequestDto
    {
        public int ServiceId { get; set; }
        public string Message { get; set; } = string.Empty;
        public decimal AgreedPrice { get; set; }
    }
}