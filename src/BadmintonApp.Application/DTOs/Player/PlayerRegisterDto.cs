using BadmintonApp.Application.DTOs.WorkingHourDtos;
using BadmintonApp.Domain.Trainings.Enums;
using System;
using System.Collections.Generic;

namespace BadmintonApp.Application.DTOs.Player
{
    public class PlayerRegisterDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string ImageUrl { get; set; }
        public Guid ClubId { get; set; }
        public PlayerLevel Level { get; set; }

        public DateTime DoB { get; set; }

        public List<WorkingHourDto> WorkingHours { get; set; } = new();
    }
}
