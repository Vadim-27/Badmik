using BadmintonApp.Domain.Clubs;
using System;

namespace BadmintonApp.Domain.Core;

public class StaffClubRole
{   
    public Guid StaffId { get; set; }
    public Staff Staff { get; set; }

    public Guid ClubId { get; set; }
    public Club Club { get; set; }

    public Guid RoleId { get; set; }
    public Role Role { get; set; }
}
