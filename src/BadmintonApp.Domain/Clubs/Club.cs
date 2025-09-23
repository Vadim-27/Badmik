using System.Collections.Generic;
using System;
using BadmintonApp.Domain.Core;

namespace BadmintonApp.Domain.Clubs;

public class Club
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string City { get; set; }
    public string Address { get; set; }
    public int TotalCourts { get; set; }

    public List<WorkingHour> WorkingHours { get; set; } = new();
    public List<UserClubRole> UserRoles { get; set; } = new();
}
