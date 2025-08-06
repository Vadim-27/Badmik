using System;

namespace BadmintonApp.Domain.Trainings;

public class TrainingParticipant
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime RegisteredAt { get; set; }
}
