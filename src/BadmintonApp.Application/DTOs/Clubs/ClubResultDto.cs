using System;

namespace BadmintonApp.Application.DTOs.Clubs;

public class ClubResultDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string City { get; set; }
    public string Address { get; set; }
    public int TotalCourts { get; set; }

    public WorkingHourDto WorkingHours { get; set; } = new();
}
