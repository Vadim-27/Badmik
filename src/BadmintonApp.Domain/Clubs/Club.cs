using System.Collections.Generic;
using System;
using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.WorkingHours;

namespace BadmintonApp.Domain.Clubs;

public class Club
{
    public Guid Id { get; set; }

    public string Name { get; set; }
    public string Alias { get; set; }
    public string City { get; set; }
    public string Address { get; set; }

    public string Email { get; set; }
    public string Phone { get; set; }
    public string Website { get; set; }
    public string Description { get; set; }
    public int Order { get; set; } = 0;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public List<Location> Locations { get; set; } = new();
}
