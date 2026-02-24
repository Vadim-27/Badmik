using BadmintonApp.Domain.Enums.Booking;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Booking
{
    public sealed class UpdateAttendanceDto
    {
        public AttendanceStatus AttendanceStatus { get; set; } // Attended/NoShow/Cancelled
    }
}
