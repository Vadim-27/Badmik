using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.Trainings.Enums;
using System;

namespace BadmintonApp.Application.DTOs.Player;

public class PlayerDto
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public string ImageUrl { get; set; }
    public PlayerLevel Level { get; set; }
}
