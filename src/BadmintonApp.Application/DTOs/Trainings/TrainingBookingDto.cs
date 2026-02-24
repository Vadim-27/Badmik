using BadmintonApp.Domain.Enums.Booking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Trainings
{
    public sealed class TrainingBookingDto
    {
        public Guid BookingId { get; set; }
        public Guid PlayerId { get; set; }

        public bool IsWaitlist { get; set; }

        public BookingConfirmationStatus ConfirmationStatus { get; set; }
        public AttendanceStatus AttendanceStatus { get; set; }
        public CoverageStatus CoverageStatus { get; set; }

        public Guid? MembershipIdUsed { get; set; }
        public Guid? PaymentId { get; set; }

        public DateTime CreatedAtUtc { get; set; }
    }
}
