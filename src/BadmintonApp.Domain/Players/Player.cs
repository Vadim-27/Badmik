using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.Enums.Player;
using System;

namespace BadmintonApp.Domain.Players;

public class Player 
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User User { get; set; }
    public PlayerLevel Level { get; set; }
}