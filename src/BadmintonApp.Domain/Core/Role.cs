using BadmintonApp.Domain.Clubs;
using System;
using System.Collections.Generic;

namespace BadmintonApp.Domain.Core;

public class Role
{
    public Guid Id { get; set; }    
    public string Name { get; set; } = null!;
    public bool IsSystem { get; set; } = false!;
    public List<RolePermission> RolePermissions { get; set; }
}
