using BadmintonApp.Domain.Clubs;
using BadmintonApp.Domain.Logs;
using BadmintonApp.Domain.Permissions;
using BadmintonApp.Domain.Trainings;
using BadmintonApp.Domain.Users;
using BadmintonApp.Infrastructure.Persistence.Configurations;
using Microsoft.EntityFrameworkCore;

namespace BadmintonApp.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            
            base.OnModelCreating(modelBuilder);
        }

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
    }
}
