using BadmintonApp.Domain.Clubs;
using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Player;
using BadmintonApp.Domain.Enums.Training;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Players
{
    public class PlayerClubMembership
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid PlayerId { get; set; }
        public Player Player { get; set; } = null!;

        public Guid ClubId { get; set; }
        public Club Club { get; set; } = null!;

        public MembershipStatus Status { get; set; } // Active, Pending, Suspended, Left
        public TrainingType TrainingType { get; set; }
        public SportType SportType { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime? ValidUntil { get; set; }

        // balance cache
        public int TrainingsLeft { get; set; }
        public int TrainingsTotalGranted { get; set; }
    }
}
