using BadmintonApp.Domain.Enums.Booking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Trainings
{
    public class TrainingBooking
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ClubId { get; set; }

        public Guid TrainingSessionId { get; set; }

        public Guid PlayerId { get; set; }
        
        public Guid BookedByUserId { get; set; }

        public bool IsWaitlist { get; set; }

        public BookingConfirmationStatus ConfirmationStatus { get; set; } = BookingConfirmationStatus.NotRequired;

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
        public DateTime? RespondUntilUtc { get; set; }
        public DateTime? ConfirmedAtUtc { get; set; }

        // attendance
        public AttendanceStatus AttendanceStatus { get; set; } = AttendanceStatus.Registered;
        public DateTime? AttendanceConfirmedAtUtc { get; set; }
        public Guid? AttendanceConfirmedByUserId { get; set; }

        // coverage/payment
        public CoverageStatus CoverageStatus { get; set; } = CoverageStatus.None;

        public Guid? MembershipIdUsed { get; set; }  // 
        public Guid? PaymentId { get; set; }         // if paid cash/online

        // when paid /covered and by whom (for audit and reporting)
        public DateTime? CoveredAtUtc { get; set; }
        public Guid? CoveredByUserId { get; set; }
    }
}
