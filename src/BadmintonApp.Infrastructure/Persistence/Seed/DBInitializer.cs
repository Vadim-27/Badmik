using BadmintonApp.Domain.Clubs;
using BadmintonApp.Domain.Permissions;
using BadmintonApp.Domain.Trainings.Enums;
using BadmintonApp.Domain.Users;
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
            if (!await context.Users.AnyAsync())
            {

                var passwordHasher = new PasswordHasher<User>();

                var user = new User
                {
                    Id = Guid.NewGuid(),
                    Email = "admin@badminton.ua",
                    FirstName = "Admin",
                    LastName = "User",
                    Role = "Admin",
                    DoB = new DateTime(1990, 1, 1),
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    Rank = "Pro",
                    Level = PlayerLevel.A,
                    ImageUrl = "https://example.com/image.jpg"
                };


                user.PasswordHash = passwordHasher.HashPassword(user, "admin123");

                context.Users.AddRange(user);
                await context.SaveChangesAsync();
            }

            if (!await context.Roles.AnyAsync())
            {
                await context.Roles.AddAsync(new Domain.Permissions.Role { 
                    Id = Guid.NewGuid(),
                     Type = RoleType.ClubAdmin,
                     Name = RoleType.ClubAdmin.ToString(),
                      Permissions = 
                      [
                          PermissionType.ClubsManageAll,
                          PermissionType.TrainingsManage
                      ]
                });

                await context.SaveChangesAsync();
            }
        }
    }
}
