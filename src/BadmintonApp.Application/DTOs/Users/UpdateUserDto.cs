using System;

namespace BadmintonApp.Application.DTOs.Users
{
    public class UpdateUserDto : IUserLikeDto
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime DoB { get; set; }
        public Guid? ClubId { get; set; }
    }
}
