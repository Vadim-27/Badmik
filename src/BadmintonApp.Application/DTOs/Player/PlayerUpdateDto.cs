using BadmintonApp.Domain.Trainings.Enums;
using System;

namespace BadmintonApp.Application.DTOs.Player;

public class PlayerUpdateDto
{
    public Guid Id { get; set; }
    public string Email { get; set; }   
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string ImageUrl { get; set; }
    public Guid ClubId { get; set; }
    public PlayerLevel Level { get; set; }

    public DateTime DoB { get; set; }
}
