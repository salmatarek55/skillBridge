namespace SkillBridge.Models.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;

        // Navigation Property
        public ICollection<Service> Services { get; set; } = new List<Service>();
    }
}