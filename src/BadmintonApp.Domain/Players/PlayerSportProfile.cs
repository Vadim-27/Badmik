using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Player;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Players
{
    public class PlayerSportProfile
    {
        public Guid PlayerId { get; set; }
        public Player Player { get; set; } = null!;

        public SportType Sport { get; set; }    // enum
        public PlayerLevel Level { get; set; }  // enum
    }
}
