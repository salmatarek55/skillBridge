namespace SkillBridge.Models.DTOs.Ratings
{
    public class RatingDto
    {
        public int Id { get; set; }
        public string ServiceTitle { get; set; } = string.Empty;
        public string ClientName { get; set; } = string.Empty;
        public int RatingValue { get; set; }
        public string? ReviewText { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

