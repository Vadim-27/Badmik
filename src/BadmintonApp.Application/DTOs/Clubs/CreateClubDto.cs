using BadmintonApp.Application.DTOs.WorkingHourDtos;
using System.Collections.Generic;

namespace BadmintonApp.Application.DTOs.Clubs;

public class CreateClubDto
{
    public string Name { get; set; }
    public string Alias { get; set; }
    public string City { get; set; }
    public string Address { get; set; }

    public string Email { get; set; }
    public string Phone { get; set; }
    public string Website { get; set; }
    public string Description { get; set; }

    public int Order { get; set; } = 0;
}
