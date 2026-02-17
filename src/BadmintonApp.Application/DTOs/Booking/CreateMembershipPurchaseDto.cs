using BadmintonApp.Domain.Enums.Payment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Booking
{
    public sealed class CreateMembershipPurchaseDto
    {
        public Guid PlayerId { get; set; }
        public Guid PlanId { get; set; }
        public Guid ClubId { get; set; }

        // payment info (MVP: cash or online placeholder)
        public PaymentMethod Method { get; set; } = PaymentMethod.Cash;
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "UAH";
        public string? Note { get; set; }
    }
}
