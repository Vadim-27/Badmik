using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Trainings
{
    public sealed class CreateSessionFromScheduleDto
    {
        public Guid ScheduleId { get; set; }

        // day
        public DateTime Date { get; set; }

        public Guid? TrainerId { get; set; }
        public int? OverrideCourtsUsed { get; set; }
        public int? OverrideMaxPlayers { get; set; }
    }
}
