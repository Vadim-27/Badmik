using BadmintonApp.Domain.Enums.Club;
using BadmintonApp.Domain.WorkingHours;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Clubs
{

    public class Location
    {
        public Guid Id { get; set; }

        public Guid ClubId { get; set; }
        public Club Club { get; set; }

        public string Name { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string ShortDescription { get; set; }
        public string Description { get; set; }
        public string PriceFrom { get; set; }
        public int Order { get; set; } = 0;

        public bool IsActive { get; set; } = true;
        public LocationLabelType Label { get; set; } = LocationLabelType.None;

        public List<Court> Courts { get; set; } = new();

        public string Logo { get; set; }
        public List<LocationAmenity> Amenities { get; set; } = new();
        public List<LocationImage> Images { get; set; } = new();
        public List<WorkingHour> WorkingHours { get; set; } = new();

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
