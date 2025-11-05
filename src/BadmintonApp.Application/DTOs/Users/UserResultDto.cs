using BadmintonApp.Application.DTOs.WorkingHourDtos;
using System;

namespace BadmintonApp.Application.DTOs.Users
{
    public class UserResultDto 
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string FullName => $"{FirstName} {LastName}";
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
        public DateTime  DoB { get; set; }
        public string Rank { get; set; }
        public string Level { get; set; }

        public WorkingHourDto WorkingHours { get; set; } = new();
    }
}
