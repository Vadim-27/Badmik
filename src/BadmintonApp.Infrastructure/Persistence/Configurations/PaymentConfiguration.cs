using BadmintonApp.Domain.Payments;
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
    public sealed class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> b)
        {
            b.ToTable("Payments");

            b.HasKey(x => x.Id);

            b.Property(x => x.ClubId).IsRequired();
            b.Property(x => x.PlayerId).IsRequired();

            b.Property(x => x.Purpose)
                .HasConversion<int>()
                .IsRequired();

            b.Property(x => x.Method)
                .HasConversion<int>()
                .IsRequired();

            b.Property(x => x.Status)
                .HasConversion<int>()
                .IsRequired();

            b.Property(x => x.Amount)
                .HasColumnType("numeric(12,2)")
                .IsRequired();

            b.Property(x => x.Currency)
                .HasMaxLength(8)
                .IsRequired();

            b.Property(x => x.Provider).HasMaxLength(64);
            b.Property(x => x.ProviderPaymentId).HasMaxLength(128);
            b.Property(x => x.CheckoutUrl).HasMaxLength(512);

            b.Property(x => x.TrainingBookingId);
            b.Property(x => x.MembershipId);

            b.Property(x => x.CreatedByUserId).IsRequired();
            b.Property(x => x.CreatedAtUtc).IsRequired();
            b.Property(x => x.PaidAtUtc);

            b.Property(x => x.Note).HasMaxLength(1024);

            // Indexes
            b.HasIndex(x => new { x.ClubId, x.CreatedAtUtc });
            b.HasIndex(x => new { x.PlayerId, x.CreatedAtUtc });

            // Relationship: Payment -> TrainingBooking (optional)
            // (No reverse navigation configured)
            b.HasOne<TrainingBooking>()
                .WithMany()
                .HasForeignKey(x => x.TrainingBookingId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relationship: Payment -> Membership (optional)
            b.HasOne<PlayerClubMembership>()
                .WithMany()
                .HasForeignKey(x => x.MembershipId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
