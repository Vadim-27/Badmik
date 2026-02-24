using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Player
{
    public class UpdatePlayerSportProfilesDto
    {
        public List<PlayerSportProfileDto> SportProfiles { get; set; } = new();
    }
}
