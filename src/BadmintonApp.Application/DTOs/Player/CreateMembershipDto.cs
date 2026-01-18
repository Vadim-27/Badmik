using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Player
{
    public class CreateMembershipDto
    {
        public Guid ClubId { get; set; }          
        public DateTime ValidFrom { get; set; }
        public DateTime? ValidUntil { get; set; }

        public int TrainingsGranted { get; set; }   
    }
}
