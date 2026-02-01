using BadmintonApp.Application.DTOs.WorkingHourDtos;
using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Player;
using System;
using System.Collections.Generic;

namespace BadmintonApp.Application.DTOs.Player
{
    public class CreatePlayerDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public Guid ClubId { get; set; }
        public GenderType Gender { get; set; }
        public DateTime DoB { get; set; }
        public List<PlayerSportProfileDto> SportProfiles { get; set; } = new();
    }
}
