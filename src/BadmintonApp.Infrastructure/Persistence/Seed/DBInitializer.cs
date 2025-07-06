using BadmintonApp.Domain.Users;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Seed
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            if (await context.Users.AnyAsync()) return;

            var users = new List<User>
        {
            new User
            {
                Id = Guid.NewGuid().ToString(),
                Email = "admin@badminton.ua",
                PasswordHash = "adminpass", // замінити на хеш
                FirstName = "Admin",
                LastName = "User",
                Role = "Admin",
                DoB = new DateTime(1990, 1, 1),
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                Rank = "Pro",
                Level = "A",
                ImageUrl = "https://example.com/image.jpg"
            }
        };

            context.Users.AddRange(users);
            await context.SaveChangesAsync();
        }
    }
}
