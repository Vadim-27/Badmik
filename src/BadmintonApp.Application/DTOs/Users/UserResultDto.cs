using BadmintonApp.Application.DTOs.WorkingHourDtos;
using BadmintonApp.Domain.Enums;
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
        public DateTime  DoB { get; set; }
        public GenderType Gender { get; set; }
    }
}
