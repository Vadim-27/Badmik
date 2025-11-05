using BadmintonApp.Application.DTOs.WorkingHourDtos;
using System.Collections.Generic;

namespace BadmintonApp.Application.DTOs.Clubs;

public class CreateClubDto
{
    public string Name { get; set; }

    public Location Location { get; set; }
    
    public int CourtCount { get; set; }
    
    public WorkingHourDto WorkingHours { get; set; } = new();
}

public class Location
{
    public string City { get; set; }
    public string Address { get; set; }
}
