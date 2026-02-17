using BadmintonApp.Domain.Clubs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Configurations
{
    public sealed class ClubMembershipPlanConfiguration : IEntityTypeConfiguration<ClubMembershipPlan>
    {
        public void Configure(EntityTypeBuilder<ClubMembershipPlan> b)
        {
            b.ToTable("ClubMembershipPlans");

            b.HasKey(x => x.Id);

            b.Property(x => x.ClubId).IsRequired();

            b.Property(x => x.Name)
                .HasMaxLength(128)
                .IsRequired();

            b.Property(x => x.DurationDays).IsRequired();
            b.Property(x => x.TrainingsGranted).IsRequired();

            b.Property(x => x.SportType).HasConversion<int>().IsRequired();
            b.Property(x => x.TrainingType).HasConversion<int>().IsRequired();

            b.Property(x => x.IsActive).IsRequired();

            b.Property(x => x.CreatedAtUtc).IsRequired();
            b.Property(x => x.UpdatedAtUtc).IsRequired();

            // Unique plan name per club
            b.HasIndex(x => new { x.ClubId, x.Name }).IsUnique();

            // Helpful filters/sorting
            b.HasIndex(x => new { x.ClubId, x.IsActive });
            b.HasIndex(x => new { x.ClubId, x.UpdatedAtUtc });
        }
    }
}
