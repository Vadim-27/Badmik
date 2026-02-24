using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Training;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Clubs
{
    public class ClubMembershipPlan
    {
        public Guid Id { get; set; }
        public Guid ClubId { get; set; }

        public string Name { get; set; } = null!;
        public int DurationDays { get; set; }
        public int TrainingsGranted { get; set; }

        public SportType SportType { get; set; }
        public TrainingType TrainingType { get; set; }

        public bool IsActive { get; set; }
        public DateTime CreatedAtUtc { get; set; }
        public DateTime UpdatedAtUtc { get; set; }
    }
}
