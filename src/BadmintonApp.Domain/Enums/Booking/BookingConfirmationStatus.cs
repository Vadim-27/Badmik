using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Enums.Booking
{
    public enum BookingConfirmationStatus
    {
        NotRequired = 0,
        Pending = 1,
        Confirmed = 2,
        Declined = 3,
        Expired = 4
    }
}
