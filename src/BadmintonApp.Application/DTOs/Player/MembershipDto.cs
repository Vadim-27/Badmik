using BadmintonApp.Domain.Enums.Player;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Player
{
    public class MembershipDto
    {
        public Guid Id { get; set; }
        public Guid ClubId { get; set; }
        public MembershipStatus Status { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime? ValidUntil { get; set; }
        public int TrainingsLeft { get; set; }
        public int TrainingsTotalGranted { get; set; }
    }
}
