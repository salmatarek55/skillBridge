namespace SkillBridge.Models.DTOs.Dashboard
{
    public class CacheStatsDto
    {
        public bool IsServicesCached { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime CheckedAt { get; set; }
    }
}