using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Booking
{
    public sealed class ConfirmBookingDto
    {
        public bool Accept { get; set; } // true=confirm, false=decline
    }
}
