namespace SkillBridge.Models.DTOs.Requests
{
    public class UpdateRequestStatusDto
    {
        public string Status { get; set; } = string.Empty; // "Accepted" / "Rejected" / "Completed"
    }
}