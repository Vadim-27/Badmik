using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Configurations
{
    using BadmintonApp.Domain.Players;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore.Metadata.Builders;

    public sealed class PlayerClubMembershipConfiguration : IEntityTypeConfiguration<PlayerClubMembership>
    {
        public void Configure(EntityTypeBuilder<PlayerClubMembership> b)
        {
            b.ToTable("PlayerClubMemberships");

            b.HasKey(x => x.Id);

            b.Property(x => x.PlayerId).IsRequired();
            b.Property(x => x.ClubId).IsRequired();

            // Plan
            b.Property(x => x.PlanId).IsRequired();

            b.HasOne(x => x.Plan)
                .WithMany() // or .WithMany(p => p.Memberships) if you add navigation on plan
                .HasForeignKey(x => x.PlanId)
                .OnDelete(DeleteBehavior.Restrict);

            b.Property(x => x.Status)
                .HasConversion<int>()
                .IsRequired();

            b.Property(x => x.ValidFrom).IsRequired();
            b.Property(x => x.ValidUntil);

            b.Property(x => x.TrainingsLeft).IsRequired();
            b.Property(x => x.TrainingsTotalGranted).IsRequired();

            b.Property(x => x.UpdatedAtUtc).IsRequired();
            b.Property(x => x.UpdatedByUserId);

            // Indexes
            b.HasIndex(x => new { x.ClubId, x.PlayerId });
            b.HasIndex(x => x.PlanId);
        }
    }
}
