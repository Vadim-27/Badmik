using BadmintonApp.Domain.Clubs;
using System;
using System.Collections.Generic;

namespace BadmintonApp.Domain.Core;

public class Role
{
    public Guid Id { get; set; }    
    public string Name { get; set; } = null!;
    public Guid? ClubId { get; set; }  // null = system/global role, not null = custom role for club
    public Club? Club { get; set; }
    public bool IsSystem { get; set; } = false!;
    public List<RolePermission> RolePermissions { get; set; }
}
