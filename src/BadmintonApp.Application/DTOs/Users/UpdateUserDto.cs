using System;

namespace BadmintonApp.Application.DTOs.Users
{
    public class UpdateUserDto
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
        public DateTime DoB { get; set; } // not sure if it should be updated
        public string Rank { get; set; }
        public string Level { get; set; }
        
    }
}
