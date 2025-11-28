using BadmintonApp.Application.DTOs.WorkingHourDtos;
using BadmintonApp.Domain.Enums.Club;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Clubs
{
    public class CreateLocationDto
    {
        public Guid ClubId { get; set; }

        public string Name { get; set; } = default!;
        public string City { get; set; } = default!;
        public string Address { get; set; } = default!;

        public LocationLabelType Label { get; set; } = LocationLabelType.None;
        public bool IsActive { get; set; } = true;
        public int Order { get; set; } = 1;

        public string? PriceText { get; set; }
        public string? Description { get; set; }

        public List<LocationSportDto> Sports { get; set; } = new();

        public List<WorkingHourDto> WorkingHours { get; set; } = new();
    }
}
