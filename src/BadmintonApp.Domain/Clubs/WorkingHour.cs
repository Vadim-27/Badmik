using System;

namespace BadmintonApp.Domain.Clubs;

public class WorkingHour
{
    public Guid Id { get; set; }

    public Guid ClubId { get; set; }
    public Club Club { get; set; }

    public DayOfWeek DayOfWeek { get; set; }

    public TimeOnly StartTime { get; set; } // TimeSpan
    public TimeOnly EndTime { get; set; } // TimeSpan
}
