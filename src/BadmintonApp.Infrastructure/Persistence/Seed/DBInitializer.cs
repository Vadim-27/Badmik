using BadmintonApp.Domain.Clubs;
using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.Enums;
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
            var now = DateTime.UtcNow;

            // Ensure club exists
            var club = await context.Clubs.FirstOrDefaultAsync(c => c.Id == clubId);

            if (club == null)
            {
                // Create a new default club with all required fields
                club = new Club
                {
                    Id = clubId,
                    Name = "Default Club",
                    Alias = "default-club",              // important for GetByAlias
                    City = "Kyiv",
                    Address = "Main Hall 1",

                    Email = "admin@badmik.com.ua",
                    Phone = "+380000000000",             // put a real phone or dummy
                    Website = "https://badmik.com.ua",   // or null if you prefer
                    Description = "Seeded default club",

                    Order = 0,
                    IsActive = true,
                    CreatedAt = now,
                    UpdatedAt = now
                };

                context.Clubs.Add(club);
                await context.SaveChangesAsync();
            }

            await CreateStaffAsync(context, club, "admin@badmik.com.ua", "Admin", "User", "admin123",
                Domain.Enums.Staff.StaffPositionType.Administrator, true, "");

            await CreateStaffAsync(context, club, "vhusarov@badmik.com.ua", "Vadym", "Husarov", "husarov123",
                Domain.Enums.Staff.StaffPositionType.Administrator, false, "ClubAdmin");

            await CreateStaffAsync(context, club, "mzara@badmik.com.ua", "Max", "Zaraisky", "zaraisky123",
                Domain.Enums.Staff.StaffPositionType.Trainer, false, "ClubTrainer");


        }

        private static async Task<User> CreateStaffAsync(ApplicationDbContext context, Club club,
            string email, string firstName, string lastName, string password, 
            Domain.Enums.Staff.StaffPositionType positionType, bool isAdmin, string roleName)
        {
            // --- 1️⃣ Ensure User exists ---
            var user = await context.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                var passwordHasher = new PasswordHasher<User>();

                user = new User
                {
                    Id = Guid.NewGuid(),
                    Email = email,
                    FirstName = firstName,
                    LastName = lastName,
                    DoB = DateTime.SpecifyKind(new DateTime(1995, 1, 1), DateTimeKind.Utc),
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    ImageUrl = "https://example.com/avatar.jpg",
                    ClubId = club.Id,
                    IsAdmin = isAdmin
                };
                user.PasswordHash = passwordHasher.HashPassword(user, password);

                context.Users.Add(user);
                await context.SaveChangesAsync();
            }

            // --- 2️⃣ Ensure Staff exists ---
            var staff = await context.Staffs
                .FirstOrDefaultAsync(s => s.UserId == user.Id && s.ClubId == club.Id);

            if (staff == null)
            {
                staff = new Staff
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    ClubId = club.Id,
                    PositionType = positionType,
                    CreatedAt = DateTime.UtcNow
                };

                context.Staffs.Add(staff);
                await context.SaveChangesAsync();
            }

            // --- 3️⃣ Assign Role ---
            var role = await context.Roles
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Name == roleName);

            if (role == null)
            {
                return user;
            }

            var existingRole = await context.StaffClubRoles
                .FirstOrDefaultAsync(scr => scr.StaffId == staff.Id && scr.RoleId == role.Id && scr.ClubId == club.Id);

            if (existingRole == null)
            {
                context.StaffClubRoles.Add(new StaffClubRole
                {
                    StaffId = staff.Id,
                    RoleId = role.Id,
                    ClubId = club.Id
                });

                await context.SaveChangesAsync();
            }

            return user;
        }
    }
}
