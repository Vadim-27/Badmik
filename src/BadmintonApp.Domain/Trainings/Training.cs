using BadmintonApp.Domain.Trainings.Enums;
using System;
using System.Collections.Generic;

namespace BadmintonApp.Domain.Trainings;

public class Training
{
    public Guid Id { get; set; }
    public Guid ClubId { get; set; }
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
    public List<TrainingParticipant> Participants { get; set; } = new();
    public List<TrainingQueueEntry> Queue { get; set; } = new();
}
