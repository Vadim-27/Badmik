using BadmintonApp.Application.DTOs.WorkingHourDtos;
using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Club;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Clubs
{
    public class LocationResultDto
    {
        public Guid Id { get; set; }
        public Guid ClubId { get; set; }

        public string Name { get; set; } = default!;
        public string City { get; set; } = default!;
        public string Address { get; set; } = default!;

        public LocationLabelType Label { get; set; }
        public bool IsActive { get; set; }
        public int Order { get; set; }

        public string? PriceText { get; set; }
        public string? Description { get; set; }

        public int CourtCount { get; set; }

        public SportType[] SportTypes { get; set; } = Array.Empty<SportType>();
        public List<LocationSportDto> Sports { get; set; } = new();

        public string? Logo { get; set; }
        public List<AmenityType> Amenities { get; set; } = new();
        public List<LocationImageDto> Images { get; set; } = new();

        public WorkingHourDto WorkingHours { get; set; } = new();

        
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
