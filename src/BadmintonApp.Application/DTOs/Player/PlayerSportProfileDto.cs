using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Player;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Player
{
    public class PlayerSportProfileDto
    {
        public SportType Sport { get; set; }
        public PlayerLevel Level { get; set; }
    }
}
