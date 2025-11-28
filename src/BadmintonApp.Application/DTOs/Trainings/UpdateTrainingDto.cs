using BadmintonApp.Domain.Enums.Player;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Trainings;

public class UpdateTrainingDto
{
    public DateTime Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public bool IsRecurringWeekly { get; set; }
    public int CourtsUsed { get; set; }
    public int MaxPlayers { get; set; }
    public Guid? TrainerId { get; set; }
    public List<PlayerLevel> AllowedLevels { get; set; } = new();
}
