using BadmintonApp.Domain.Enums.Player;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Players
{
    public class PlayerMembershipTransaction
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid MembershipId { get; set; }
        public PlayerClubMembership Membership { get; set; } = null!;

        public MembershipTransactionType Type { get; set; }
        public int Amount { get; set; }
        public int BalanceAfter { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Guid? TrainingId { get; set; }
        public Guid? CreatedByUserId { get; set; }
        public string? Comment { get; set; }
    }
}
