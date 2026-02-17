using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Booking
{
    public sealed class CreateBookingDto
    {
        public Guid TrainingSessionId { get; set; }
        public Guid PlayerId { get; set; } // target player
    }
}
