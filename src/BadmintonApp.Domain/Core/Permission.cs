using BadmintonApp.Domain.Enums.Permission;
using System;
using System.Collections.Generic;

namespace BadmintonApp.Domain.Core;

public class Permission
{
    public Guid Id { get; set; }
    public PermissionType Type { get; set; }
    public List<RolePermission> RolePermissions { get; set; }

}
