using System;

namespace BadmintonApp.Application.DTOs.Role;

public class RoleBindPermissionDto
{
    public Guid RoleId { get; set; }
    public Guid PermissionId { get; set; }
}
