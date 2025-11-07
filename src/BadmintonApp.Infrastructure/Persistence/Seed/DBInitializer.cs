using BadmintonApp.Domain.Clubs;
using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.Trainings.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Seed
{
    public static class DbInitializer
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            var clubId = Guid.Parse("2672dab8-b42d-4c58-a67b-7e39e2fb0e5e");

            // Ensure club exists
            var club = await context.Clubs.FirstOrDefaultAsync(c => c.Id == clubId);
            if (club == null)
            {
                club = new Club
                {
                    Id = clubId,
                    Name = "Default Club",
                    City = "Kyiv",
                    Address = "Main Hall 1",
                    TotalCourts = 4
                };
                context.Clubs.Add(club);
                await context.SaveChangesAsync();
            }

            // --- Ensure admin user exists (get-or-create) ---
            var user = await context.Users
                .FirstOrDefaultAsync(u => u.Email == "admin@badminton.ua");

            if (user == null)
            {
                var passwordHasher = new PasswordHasher<User>();

                user = new User
                {
                    Id = Guid.NewGuid(),
                    Email = "admin@badminton.ua",
                    FirstName = "Admin",
                    LastName = "User",
                    DoB = DateTime.SpecifyKind(new DateTime(1990, 1, 1), DateTimeKind.Utc),
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    ImageUrl = "https://example.com/image.jpg",
                    ClubId = club.Id,
                    IsAdmin = true
                };
                user.PasswordHash = passwordHasher.HashPassword(user, "admin123");

                context.Users.Add(user);
                await context.SaveChangesAsync();
            }

            // --- Ensure Staff for Admin ---
            var existingStaff = await context.Staffs
                .FirstOrDefaultAsync(s => s.UserId == user.Id);

            if (existingStaff == null)
            {
                var staff = new Staff
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    ClubId = club.Id,
                    PositionType = Domain.Enums.Staff.StaffPositionType.Administrator,
                    CreatedAt = DateTime.UtcNow
                };

                context.Staffs.Add(staff);
                await context.SaveChangesAsync();
            }
        }
    }
}
