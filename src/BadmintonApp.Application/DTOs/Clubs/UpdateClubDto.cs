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
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Website { get; set; }
    public string Description { get; set; }

    public bool IsActive { get; set; }
    public int Order { get; set; }
}
