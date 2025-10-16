using BadmintonApp.Domain.Clubs;
using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.Logs;
using BadmintonApp.Domain.Trainings;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace BadmintonApp.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {            
            modelBuilder.Entity<RolePermission>().HasKey( c => new 
            {
                c.RoleId,
                c.PermissionId
            });
            modelBuilder.Entity<UserRole>().HasKey(c => new
            {
                c.RoleId,
                c.UserId
            });
            modelBuilder.Entity<UserClubRole>().HasKey(c => new
            {
                c.UserId,
                c.RoleId,
                c.ClubId
            });
            SeedData(modelBuilder);            

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<RolePermission> RolePermissions { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<User> Users => Set<User>();
        public DbSet<Club> Clubs => Set<Club>();
        public DbSet<UserClubRole> UserClubRoles => Set<UserClubRole>();
        public DbSet<WorkingHour> WorkingHours => Set<WorkingHour>();
        public DbSet<Training> Trainings => Set<Training>();
        public DbSet<TrainingParticipant> TrainingParticipants => Set<TrainingParticipant>();
        public DbSet<TrainingQueueEntry> TrainingQueueEntries => Set<TrainingQueueEntry>();
        public DbSet<Permission> Permissions => Set<Permission>();
        public DbSet<Role> Roles => Set<Role>();
        public DbSet<Log> Logs => Set<Log>();
        public DbSet<Player> Players => Set<Player>();
        public DbSet<Staff> Staffs => Set<Staff>();

        private void SeedData(ModelBuilder modelBuilder)
        {

            Role[] roles =
            {
                new Role
                {
                    Id = Guid.Parse("45225223-0e47-4c7a-b045-38de629412e5"),
                    Name = "SuperAdmin",
                },
                new Role
                {
                    Id = Guid.Parse("98e5cfcd-cada-486a-96bb-30b6a9a60174"),
                    Name = "ClubAdmin",
                },
                new Role
                {
                    Id = Guid.Parse("bb074c39-08df-45d9-8e74-5b6a07257883"),
                    Name = "ClubManager",
                },
                new Role
                {
                    Id = Guid.Parse("5b0ac8d3-e270-422f-af95-99e8be79e47a"),
                    Name = "Player",
                }
            };
            modelBuilder.Entity<Role>().HasData(roles);

            Permission[] permissions =
            {
                new Permission
                {
                    Id = Guid.Parse("fe2da074-fff1-426f-b045-44427951a6eb"),
                    Name = "ClubsView" // 0
                },
                new Permission
                {
                    Id = Guid.Parse("31f6a90f-2d85-4d9d-92aa-85e702289278"),
                    Name = "PlayersManage" // 1
                },
                new Permission
                {
                    Id = Guid.Parse("ac341087-ee9a-49c1-ac8b-0b34e28cdee8"),
                    Name = "ClubsAssignAdmin" // 2
                },
                new Permission
                {
                    Id = Guid.Parse("a5263fcf-69e8-47b2-8bf4-466a71292137"),
                    Name = "ClubsManageAll" // 3
                },
                new Permission
                {
                    Id = Guid.Parse("37368913-d1ac-488a-ad47-44d75c453f5a"),
                    Name = "TrainingsManage" // 4
                },
                new Permission
                {
                    Id = Guid.Parse("b0010909-dd1e-4e33-ab89-7a09fddcbf49"),
                    Name = "ClubsManageOwn" // 5
                },
                new Permission
                {
                    Id = Guid.Parse("08556e74-e70f-4f19-8322-8a6371a359b7"),
                    Name = "RolesManage" // 6
                },
                new Permission
                {
                    Id = Guid.Parse("7167cda8-c1b8-425b-af52-eb9aa3e27d2b"),
                    Name = "AnalyticsViewAll"
                },
                new Permission
                {
                    Id = Guid.Parse("12e48bab-edee-4833-830d-129f36e26c71"),
                    Name = "AnalyticsViewOwn" // 7
                }
            };
            modelBuilder.Entity<Permission>().HasData(permissions);

            List<RolePermission> rolePermissions = [];
            foreach (var permission in permissions)
            {
                rolePermissions.Add(new RolePermission
                {
                    RoleId = roles[0].Id, //SuperAdmin
                    PermissionId = permission.Id
                });
            }
            rolePermissions.AddRange(
                new RolePermission
                {
                    RoleId = roles[1].Id,//ClubAdmin,
                    PermissionId = permissions[0].Id //ClubsView
                },
                new RolePermission
                {
                    RoleId = roles[1].Id,//ClubAdmin,
                    PermissionId = permissions[5].Id //ClubsManageOwn
                },
                new RolePermission
                { 
                    RoleId = roles[1].Id, //ClubAdmin,
                    PermissionId = permissions[1].Id // "PlayersManage"
                },
                new RolePermission
                {
                    RoleId = roles[1].Id, //ClubAdmin,
                    PermissionId = permissions[4].Id // "TrainingsManage"
                },
                new RolePermission
                {
                    RoleId = roles[1].Id, //ClubAdmin,
                    PermissionId = permissions[7].Id // "AnalyticsViewOwn"
                },
                new RolePermission
                {
                    RoleId = roles[2].Id, //ClubManager,
                    PermissionId = permissions[1].Id // "PlayersManage"
                },
                new RolePermission
                {
                    RoleId = roles[2].Id, //ClubManager,
                    PermissionId = permissions[4].Id // "TrainingsManage"
                },
                new RolePermission
                {
                    RoleId = roles[2].Id, //ClubManager,
                    PermissionId = permissions[5].Id //ClubsManageOwn
                });


            modelBuilder.Entity<RolePermission>().HasData(rolePermissions);
        }
    }
}
