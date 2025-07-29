using BadmintonApp.Domain.Users;
using System;

namespace BadmintonApp.Domain.Clubs;

public class UserClubRole
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; }

    public Guid ClubId { get; set; }
    public Club Club { get; set; }

    public RoleType Role { get; set; }
}
