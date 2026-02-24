using BadmintonApp.Domain.Players;
using BadmintonApp.Domain.Trainings;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Configurations
{
    public sealed class TrainingBookingConfiguration : IEntityTypeConfiguration<TrainingBooking>
    {
        public void Configure(EntityTypeBuilder<TrainingBooking> b)
        {
            b.ToTable("TrainingBookings");

            b.HasKey(x => x.Id);

            b.Property(x => x.ClubId).IsRequired();
            b.Property(x => x.TrainingSessionId).IsRequired();
            b.Property(x => x.PlayerId).IsRequired();
            b.Property(x => x.BookedByUserId).IsRequired();

            b.Property(x => x.IsWaitlist).IsRequired();

            b.Property(x => x.ConfirmationStatus)
                .HasConversion<int>()
                .IsRequired();

            b.Property(x => x.CreatedAtUtc).IsRequired();
            b.Property(x => x.RespondUntilUtc);
            b.Property(x => x.ConfirmedAtUtc);

            b.Property(x => x.AttendanceStatus)
                .HasConversion<int>()
                .IsRequired();

            b.Property(x => x.AttendanceConfirmedAtUtc);
            b.Property(x => x.AttendanceConfirmedByUserId);

            b.Property(x => x.CoverageStatus)
                .HasConversion<int>()
                .IsRequired();

            b.Property(x => x.MembershipIdUsed);
            b.Property(x => x.PaymentId);

            b.Property(x => x.CoveredAtUtc);
            b.Property(x => x.CoveredByUserId);

            // One player can have only one booking per session
            b.HasIndex(x => new { x.TrainingSessionId, x.PlayerId })
                .IsUnique();

            // Useful for querying session attendees + waitlist quickly
            b.HasIndex(x => new { x.TrainingSessionId, x.IsWaitlist });

            // Useful for "my bookings"
            b.HasIndex(x => new { x.PlayerId, x.CreatedAtUtc });

            // FK to Membership (if you keep navigation in booking - optional)
            // If you DON'T have navigation properties, you can remove this.
            b.HasOne<PlayerClubMembership>()
                .WithMany()
                .HasForeignKey(x => x.MembershipIdUsed)
                .OnDelete(DeleteBehavior.Restrict);

            // PaymentId is kept as scalar only (no relationship) to avoid cycles.
            // We'll link Payment -> TrainingBooking instead.
        }
    }
}
