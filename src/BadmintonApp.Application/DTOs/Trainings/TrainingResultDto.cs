using BadmintonApp.Domain.Trainings.Enums;
using System;
using System.Collections.Generic;

namespace BadmintonApp.Application.DTOs.Trainings;

public class TrainingResultDto
{
    public Guid Id { get; set; }
    public TrainingType Type { get; set; }
    public DateTime Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public bool IsRecurringWeekly { get; set; }
    public int CourtsUsed { get; set; }
    public int MaxPlayers { get; set; }
    public Guid? TrainerId { get; set; }
    public List<PlayerLevel> AllowedLevels { get; set; }
    public int CurrentPlayers { get; set; }
    public int QueueLength { get; set; }
}
