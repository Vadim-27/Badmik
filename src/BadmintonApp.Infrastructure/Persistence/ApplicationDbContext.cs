using BadmintonApp.Domain.Clubs;
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
    }
}
