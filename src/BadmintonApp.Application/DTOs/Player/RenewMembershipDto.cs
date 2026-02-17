using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Player
{
    public class RenewMembershipDto
    {
        public Guid ClubId { get; set; }
        public Guid PlanId { get; set; }
    }
}
