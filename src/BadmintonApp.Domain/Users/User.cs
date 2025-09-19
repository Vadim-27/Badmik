using BadmintonApp.Domain.Trainings.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Users
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Email { get; set; }
        public string PasswordHash { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }      

        public DateTime DoB { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }

        public string Rank { get; set; }
        public PlayerLevel Level { get; set; }

        public Guid? ClubId { get; set; }

        public string ? ImageUrl { get; set; }
    }
}
