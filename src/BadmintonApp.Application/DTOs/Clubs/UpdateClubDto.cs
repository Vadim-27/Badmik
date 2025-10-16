using BadmintonApp.Application.DTOs.WorkingHourDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Clubs;

public class UpdateClubDto
{
    public string Name { get; set; }
    public string City { get; set; }
    public string Address { get; set; }
    public int TotalCourts { get; set; }

    //public List<WorkingHourDto> WorkingHours { get; set; } = new();
    public WorkingHourDto WorkingHours { get; set; } = new();
}
