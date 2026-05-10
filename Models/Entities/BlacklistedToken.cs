
namespace SkillBridge.Models.Entities
{
    public class BlacklistedToken
    {
        public int Id { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime ExpireAt { get; set; }
    }
}