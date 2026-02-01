using BadmintonApp.Application.DTOs.Users;
using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Player;
using System;
using System.Collections.Generic;

namespace BadmintonApp.Application.DTOs.Player;

public class PlayerDto
{
    public Guid Id { get; set; }
    public Guid ClubId { get; set; }
    public string PhotoUrl { get; set; }
    public UserResultDto User { get; set; } = null!;
    public List<PlayerSportProfileDto> SportProfiles { get; set; }
}
