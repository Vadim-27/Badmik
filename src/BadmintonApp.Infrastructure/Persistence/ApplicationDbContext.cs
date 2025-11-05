using BadmintonApp.Domain.Clubs;
using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.Logs;
using BadmintonApp.Domain.Trainings;
using BadmintonApp.Domain.WorkingHours;
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
                           // 1–19: Club & Locations
                new Permission { Id = Guid.Parse("bb144aa6-d452-4c65-8dd8-26e83a343d10"), Name = "ClubView" }, // 0
                new Permission { Id = Guid.Parse("dc24d312-1e12-455e-b58d-6a5e0e1c5a26"), Name = "ClubSettingsManage" }, // 1
                new Permission { Id = Guid.Parse("c17101a7-c7f5-4cfc-99c4-c9e7bff062e0"), Name = "LocationsView" }, // 2
                new Permission { Id = Guid.Parse("e804d9ec-17e5-4cb1-97fd-d033379b2a1e"), Name = "LocationsManage" }, // 3
                new Permission { Id = Guid.Parse("f42d1226-3c8a-4690-a9cb-702d81e9d134"), Name = "CourtsManage" }, // 4

                // 20–39: Trainings
                new Permission { Id = Guid.Parse("6e378e33-7c14-41d8-9005-3211ac337ada"), Name = "TrainingsView" }, // 5
                new Permission { Id = Guid.Parse("fbcc2933-164c-4f37-a9e7-11868c34dc64"), Name = "TrainingsManage" }, // 6
                new Permission { Id = Guid.Parse("bcfd34b3-d0aa-4a84-a68e-d1c58e0a0f36"), Name = "TrainingsRegisterPlayer" }, // 7
                new Permission { Id = Guid.Parse("e30aa5ae-2e19-4a5b-a9be-40cc74bb25e4"), Name = "TrainingsCancelPlayer" }, // 8
                new Permission { Id = Guid.Parse("4fd7483a-2436-4c2c-bdd3-275e595dcd1e"), Name = "TrainingsQueueManage" }, // 9
                new Permission { Id = Guid.Parse("2264ae2c-73b2-4a8f-8e92-cc38d4cd6b6c"), Name = "TrainingsAttendanceMark" }, // 10
                new Permission { Id = Guid.Parse("b3a08f9f-263e-42cc-b02a-85b5c6a5979b"), Name = "TrainingsLevelOverride" }, // 11

                // 50–69: Players
                new Permission { Id = Guid.Parse("66d2b5fd-f0fd-4c29-92d6-e165fce4096f"), Name = "PlayersView" }, // 12
                new Permission { Id = Guid.Parse("e47c2949-6cf3-4c2f-b6b0-e252b456cacf"), Name = "PlayersManage" }, // 13
                new Permission { Id = Guid.Parse("94a13b97-2e03-41df-9c4e-84db8f5a05a1"), Name = "PlayersBalanceManage" }, // 14

                // 80–99: Staff & Roles
                new Permission { Id = Guid.Parse("7c918f93-79b3-4f0f-91de-798a888d8ec9"), Name = "StaffView" }, // 15
                new Permission { Id = Guid.Parse("f88b5e0f-78ec-40b0-ade6-dc6c0414d6b4"), Name = "StaffManage" }, // 16
                new Permission { Id = Guid.Parse("6c2dba59-81c2-4d06-a476-66c7cf930a50"), Name = "RolesView" }, // 17
                new Permission { Id = Guid.Parse("9f29376d-dbc5-4a1a-85c3-cd6d0cbac9a6"), Name = "RolesManage" }, // 18
                new Permission { Id = Guid.Parse("95a05b7b-e88d-48c1-9e65-0cfc2c4a09f6"), Name = "RolePermissionsAssign" }, // 19

                // 110–129: Notifications
                new Permission { Id = Guid.Parse("79d4ef1a-8a4a-4cb2-b63a-2307698de15b"), Name = "NotificationsView" }, // 20
                new Permission { Id = Guid.Parse("274e546f-78b0-4dc2-a7bc-548f5e92f4cc"), Name = "NotificationsManage" }, // 21

                // 130–139: Analytics
                new Permission { Id = Guid.Parse("4a6970f1-ff3e-43fd-9172-c4f3f6c2c4c7"), Name = "AnalyticsView" }, // 22

                // 140–149: Media / Branding
                new Permission { Id = Guid.Parse("f3a9df19-ea7c-4a90-a3ee-238c7f745f5f"), Name = "MediaManage" }, // 23

                // 160–169: Logs / Audit
                new Permission { Id = Guid.Parse("aa0d8c57-e388-4db4-9746-b6cc4b47fd0d"), Name = "LogsView" }, // 24

                // 180–189: Finance
                new Permission { Id = Guid.Parse("1740be12-b8a1-40db-b184-d43fd3f6b0fa"), Name = "FinanceView" }, // 25
                new Permission { Id = Guid.Parse("d474449e-3045-4418-89c7-5a7599e58033"), Name = "FinanceManage" }, // 26
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
            rolePermissions.AddRange
                (
                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[0].Id },  // ClubView
                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[1].Id },  // ClubSettingsManage
                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[2].Id },  // LocationsView
                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[3].Id },  // LocationsManage
                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[4].Id },  // CourtsManage

                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[5].Id },  // TrainingsView
                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[6].Id },  // TrainingsManage
                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[7].Id },  // TrainingsRegisterPlayer
                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[8].Id },  // TrainingsCancelPlayer
                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[9].Id },  // TrainingsQueueManage
                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[10].Id }, // TrainingsAttendanceMark
                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[11].Id }, // TrainingsLevelOverride

                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[12].Id }, // PlayersView
                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[13].Id }, // PlayersManage
                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[14].Id }, // PlayersBalanceManage

                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[15].Id }, // StaffView
                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[16].Id }, // StaffManage
                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[17].Id }, // RolesView
                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[18].Id }, // RolesManage
                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[19].Id }, // RolePermissionsAssign

                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[20].Id }, // NotificationsView
                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[21].Id }, // NotificationsManage

                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[22].Id }, // AnalyticsView

                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[23].Id }, // MediaManage

                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[24].Id }, // LogsView

                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[25].Id }, // FinanceView
                new RolePermission { RoleId = roles[1].Id, PermissionId = permissions[26].Id }  // FinanceManage
                );


            modelBuilder.Entity<RolePermission>().HasData(rolePermissions);
        }
    }
}
