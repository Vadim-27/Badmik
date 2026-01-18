using BadmintonApp.Domain.Clubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Players
{
    public class PlayerFavoriteLocation
    {
        public Guid PlayerId { get; set; }
        public Player Player { get; set; } = null!;

        public Guid LocationId { get; set; }
        public Location Location { get; set; } = null!;

        public DateTime CreatedAt { get; set; }
    }
}
