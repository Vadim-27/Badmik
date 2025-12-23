using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Clubs
{
    public class LocationImage
    {
        public Guid Id { get; set; }
        public Guid LocationId { get; set; }
        public Location Location { get; set; }
        public string Url { get; set; }
        public int Order { get; set; }
    }
}
