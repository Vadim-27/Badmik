using BadmintonApp.Domain.Enums.Player;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Trainings
{
    public class TrainingSessionLevel
    {
        public Guid TrainingSessionId { get; set; }
        public TrainingSession TrainingSession { get; set; } = null!;

        public PlayerLevel Level { get; set; }
    }
}
