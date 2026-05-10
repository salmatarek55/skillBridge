using Microsoft.EntityFrameworkCore;
using SkillBridge.Models.Entities;
using SkillBridge.Models.Enums;
using SkillBridge.Helpers;

namespace SkillBridge.Data.Seed
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(AppDbContext db)
        {
            // Seed Categories
            if (!await db.Categories.AnyAsync())
            {
                var categories = new List<Category>
                {
                    new Category { Name = "Design" },
                    new Category { Name = "FrontEnd" },
                    new Category { Name = "Backend" },
                    new Category { Name = "UI UX" },
                    new Category { Name = "Mobile" }
                };
                await db.Categories.AddRangeAsync(categories);
                await db.SaveChangesAsync();
            }
            // Seed Admin
            if (!await db.Users.AnyAsync(u => u.Role == UserRole.Admin))
            {
                var admin = new User
                {
                    FullName = "Admin",
                    Email = "admin@skillbridge.com",
                    PasswordHash = PasswordHasher.Hash("Admin@123"),
                    Role = UserRole.Admin,
                    Status = UserStatus.Active
                };
                await db.Users.AddAsync(admin);
                await db.SaveChangesAsync();
            }
        }
    }
}