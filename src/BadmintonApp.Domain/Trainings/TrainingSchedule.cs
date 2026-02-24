using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Player;
using BadmintonApp.Domain.Enums.Training;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Trainings
{
    public class TrainingSchedule
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ClubId { get; set; }
        public Guid LocationId { get; set; }

        public bool IsActive { get; set; } = true;

        public DayOfWeek DayOfWeek { get; set; }

        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }

        public SportType Sport { get; set; }
        public TrainingType Type { get; set; }
        public ICollection<TrainingScheduleLevel> Levels { get; set; }

        public int CourtsRequired { get; set; }
        public int MaxParticipants { get; set; }
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    }
}
