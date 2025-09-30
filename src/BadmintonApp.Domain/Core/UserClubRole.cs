using BadmintonApp.Domain.Clubs;
using System;

namespace BadmintonApp.Domain.Core;

public class UserClubRole
{   
    public Guid UserId { get; set; }
    public User User { get; set; }

    public Guid ClubId { get; set; }
    public Club Club { get; set; }

    public Guid RoleId { get; set; }
    public Role Role { get; set; }
}
