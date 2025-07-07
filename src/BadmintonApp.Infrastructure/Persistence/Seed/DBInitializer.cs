using BadmintonApp.Domain.Users;
using Microsoft.AspNetCore.Identity;
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

            var passwordHasher = new PasswordHasher<User>();

            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
                Email = "admin@badminton.ua",
                FirstName = "Admin",
                LastName = "User",
                Role = "Admin",
                DoB = new DateTime(1990, 1, 1),
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                Rank = "Pro",
                Level = "A",
                ImageUrl = "https://example.com/image.jpg"
            };

            
            user.PasswordHash = passwordHasher.HashPassword(user, "admin123");

            context.Users.AddRange(user);
            await context.SaveChangesAsync();
        }
    }
}
