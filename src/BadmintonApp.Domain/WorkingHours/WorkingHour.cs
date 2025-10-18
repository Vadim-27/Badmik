using BadmintonApp.Domain.Clubs;
using BadmintonApp.Domain.Core;
using System;

namespace BadmintonApp.Domain.WorkingHours;

public class WorkingHour
{
    public Guid Id { get; set; }

    public Guid? ClubId { get; set; }
    public Club Club { get; set; }  

    public Guid? StaffId { get; set; }
    public Staff Staff { get; set; }

    public DayOfWeek DayOfWeek { get; set; }

    public TimeOnly StartTime { get; set; } // TimeSpan
    public TimeOnly EndTime { get; set; } // TimeSpan
}
