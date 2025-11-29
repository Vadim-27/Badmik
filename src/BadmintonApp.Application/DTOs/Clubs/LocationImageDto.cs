using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Clubs
{
    public class LocationImageDto
    {
        public Guid Id { get; set; }
        public string Url { get; set; } = default!;
        public int Order { get; set; }
        public bool IsMain { get; set; }
    }
}
