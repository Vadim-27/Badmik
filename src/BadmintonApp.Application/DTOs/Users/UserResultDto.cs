using BadmintonApp.Application.DTOs.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Users
{
    public class UserResultDto: ResultDto
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string FullName => $"{FirstName} {LastName}";
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Role { get; set; }
        public DateTime DoB { get; set; }
        public string Rank { get; set; }
        public string Level { get; set; }
    }
}
