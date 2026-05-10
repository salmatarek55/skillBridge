namespace SkillBridge.Models.DTOs.Ratings
{
    public class CreateRatingDto
    {
        public int RequestId { get; set; }
        public int RatingValue { get; set; } // 1-5
        public string? ReviewText { get; set; }
    }
}