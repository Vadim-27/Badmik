using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Clubs
{
    public class ClubSettingsDto
    {
        public Guid ClubId { get; set; }

        public int BookingOpenBeforeDays { get; set; }
        public int UnsubscribeAllowBeforeHours { get; set; }
        public int BookingOpenHour { get; set; }
    }
}
