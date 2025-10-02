using System;
using System.Collections.Generic;

namespace BadmintonApp.Domain.Core;

public class Permission
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public List<RolePermission> RolePermissions { get; set; }

}
