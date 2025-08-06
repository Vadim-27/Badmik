using System;

namespace BadmintonApp.Domain.Trainings;

public class TrainingQueueEntry
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime QueuedAt { get; set; }
}
