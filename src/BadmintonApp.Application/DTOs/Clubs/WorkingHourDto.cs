using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Clubs
{
    public class WorkingHourDto
    {
        public TimeRangeDto Monday { get; set; }
        public TimeRangeDto Tuesday { get; set; }
        public TimeRangeDto Wednesday { get; set; }
        public TimeRangeDto Thursday { get;set; }
        public TimeRangeDto Friday { get; set; }
        public TimeRangeDto Saturday { get; set; }
        public TimeRangeDto Sunday { get; set; }
    }

    public class TimeRangeDto
    { 
        public string From { get; set; }
        public string To { get; set; }
    }
}
