using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Training;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Trainings
{
    public sealed class CreateOrUpdateScheduleDto
    {
        public Guid ClubId { get; set; }
        public Guid LocationId { get; set; }

        public bool IsActive { get; set; }

        public DayOfWeek DayOfWeek { get; set; }

        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }

        public SportType Sport { get; set; }
        public TrainingType Type { get; set; }

        public int CourtsRequired { get; set; }
        public int MaxParticipants { get; set; }

        // If you later switch to enum list: IReadOnlyList<PlayerLevel> Levels
        public IReadOnlyList<string> Levels { get; set; } = Array.Empty<string>();
    }
}
