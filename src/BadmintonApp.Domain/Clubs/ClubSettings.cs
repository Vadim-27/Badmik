using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Clubs
{
    public class ClubSettings
    {
        public Guid ClubId { get; set; }            
        public Club Club { get; set; } = null!;

        public TimeSpan BookingOpenBeforeDays { get; set; } = TimeSpan.FromDays(14);
        public TimeSpan UnsubscribeAllowBeforeHours { get; set; } = TimeSpan.FromHours(12);
        public TimeSpan BookingOpenHour { get; set; } = TimeSpan.FromHours(12);

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
