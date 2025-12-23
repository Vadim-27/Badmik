using BadmintonApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Clubs
{
    public class LocationSportDto
    {
        public SportType SportType { get; set; }

        public int CourtCount { get; set; }
    }
}
