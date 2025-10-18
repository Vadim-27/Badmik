using BadmintonApp.Domain.WorkingHours;
using System;
using System.Collections.Generic;

namespace BadmintonApp.Domain.Core
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }

        public DateTime DoB { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
          
        public Guid? ClubId { get; set; }
        public string ImageUrl { get; set; }        
    }
}
