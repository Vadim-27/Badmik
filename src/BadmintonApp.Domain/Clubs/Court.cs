using BadmintonApp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Clubs
{
    public class Court
    {
        public Guid Id { get; set; }

        public Guid LocationId { get; set; }
        public Location Location { get; set; }

        public SportType Sport { get; set; }

        public int Index { get; set; }     // 1..N
        public string Name { get; set; }   // <Sport>-<Index>

        public bool IsActive { get; set; } = true;
    }
}
