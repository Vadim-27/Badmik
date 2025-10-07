using BadmintonApp.Domain.Clubs;
using System;
using System.Collections.Generic;

namespace BadmintonApp.Domain.Core;

public class Staff
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }
    public User User { get; set; }

    public decimal Salary { get; set; }
    public List<WorkingHour> WorkingHours { get; set; } = new();

}
