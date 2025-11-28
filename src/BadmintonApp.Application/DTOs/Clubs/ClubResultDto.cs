using BadmintonApp.Application.DTOs.WorkingHourDtos;
using System;
using System.Collections.Generic;

namespace BadmintonApp.Application.DTOs.Clubs;

public class ClubResultDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = default!;
    public string City { get; set; } = default!;
    public string Alias { get; set; } = default!;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string Address { get; set; } = default!;

    public bool IsActive { get; set; }
    public int Order { get; set; }

    public int LocationCount { get; set; }
    //public List<LocationResultDto> Locations { get; set; } = new();
    //public WorkingHourDto WorkingHours { get; set; } = new();
}
