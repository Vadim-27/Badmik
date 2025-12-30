using BadmintonApp.Domain.Enums.Player;
using BadmintonApp.Domain.Enums.Training;
using System;
using System.Collections.Generic;

namespace BadmintonApp.Application.DTOs.Trainings;

public class CreateTrainingDto
{
    //public Guid ClubId { get; set; }
    public Guid? LocationId { get; set; }
    public TrainingType Type { get; set; }
    public DateTime Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public bool IsRecurringWeekly { get; set; }
    public int CourtsUsed { get; set; }
    public int MaxPlayers { get; set; }
    public Guid? TrainerId { get; set; }
    public List<PlayerLevel> AllowedLevels { get; set; } = new();
}
