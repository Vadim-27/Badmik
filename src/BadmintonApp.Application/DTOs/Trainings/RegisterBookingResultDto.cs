using BadmintonApp.Domain.Enums.Booking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Trainings
{
    public sealed class RegisterBookingResultDto
    {
        public RegisterBookingResultDto(Guid id, bool isWaitlist, BookingConfirmationStatus confirmationStatus)
        {
            BookingId = id;
            IsWaitlist = isWaitlist;
            ConfirmationStatus = confirmationStatus;
        }

        public Guid BookingId { get; set; }
        public bool IsWaitlist { get; set; }
        public BookingConfirmationStatus ConfirmationStatus { get; set; }
    }
}
