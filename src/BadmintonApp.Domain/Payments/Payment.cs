using BadmintonApp.Domain.Enums.Payment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Payments
{
    public class Payment
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ClubId { get; set; }
        public Guid PlayerId { get; set; }

        public PaymentPurpose Purpose { get; set; }
        public PaymentMethod Method { get; set; }
        public PaymentStatus Status { get; set; } = PaymentStatus.Created;

        public decimal Amount { get; set; }
        public string Currency { get; set; } = "UAH";

        public string? Provider { get; set; }          // "LiqPay", "Stripe", ...
        public string? ProviderPaymentId { get; set; }
        public string? CheckoutUrl { get; set; }

        // links
        public Guid? TrainingBookingId { get; set; }   // training session booking, for which payment was made
        public Guid? MembershipId { get; set; }        // membership purchase, for which payment was made

        // audit
        public Guid CreatedByUserId { get; set; }
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
        public DateTime? PaidAtUtc { get; set; }

        public string? Note { get; set; }
    }
}
