using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Players
{
    public class PlayerSubscription
    {
        public Guid FollowerPlayerId { get; set; }
        public Player FollowerPlayer { get; set; } = null!;

        public Guid FollowingPlayerId { get; set; }
        public Player FollowingPlayer { get; set; } = null!;

        public DateTime CreatedAt { get; set; }
    }
}
