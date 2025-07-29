using BadmintonApp.Application.DTOs.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Clubs;

public class ClubResultDto : ResultDto
{    
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string City { get; set; }
    public string Address { get; set; }
    public int TotalCourts { get; set; }

    public WorkingHourDto WorkingHours { get; set; } = new();
}
