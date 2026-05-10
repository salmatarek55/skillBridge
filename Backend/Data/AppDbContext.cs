using Microsoft.EntityFrameworkCore;
using SkillBridge.Models.Entities;

namespace SkillBridge.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Category> Categories { get; set; }


        public DbSet<User> Users => Set<User>();
        public DbSet<Service> Services => Set<Service>();
        public DbSet<ServiceImage> ServiceImages => Set<ServiceImage>();
        public DbSet<ServiceRequest> ServiceRequests => Set<ServiceRequest>();
        public DbSet<Message> Messages => Set<Message>();
        public DbSet<Rating> Ratings => Set<Rating>();

        public DbSet<BlacklistedToken> BlacklistedTokens { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
            modelBuilder.Entity<Service>()
    .HasOne(s => s.Category)
    .WithMany(c => c.Services)
    .HasForeignKey(s => s.CategoryId);
        }

    }
}
