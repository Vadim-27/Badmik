using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.Trainings.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Seed;

public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (!await context.Users.AnyAsync())
        {
            var passwordHasher = new PasswordHasher<User>();

            var existingClubId = Guid.Parse("2672dab8-b42d-4c58-a67b-7e39e2fbES");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "admin@badminton.ua",
                FirstName = "Admin",
                LastName = "User",
                DoB = new DateTime(1990, 1, 1),
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                //Rank = "Pro",
                //Level = PlayerLevel.A,
                ImageUrl = "https://example.com/image.jpg",
                ClubId = existingClubId
            };
            user.PasswordHash = passwordHasher.HashPassword(user, "admin123");

            context.Users.AddRange(user);
            await context.SaveChangesAsync();
        }
    }
}
