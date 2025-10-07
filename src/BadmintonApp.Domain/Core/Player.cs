using BadmintonApp.Domain.Trainings.Enums;
using System;

namespace BadmintonApp.Domain.Core;

public class Player 
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; }
    public PlayerLevel Level { get; set; }
}
