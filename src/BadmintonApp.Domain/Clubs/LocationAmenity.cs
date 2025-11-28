using BadmintonApp.Domain.Enums.Club;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Clubs
{
    public class LocationAmenity
    {
        public Guid Id { get; set; }
        public Guid LocationId { get; set; }
        public Location Location { get; set; }
        public AmenityType Amenity { get; set; }
    }
}
