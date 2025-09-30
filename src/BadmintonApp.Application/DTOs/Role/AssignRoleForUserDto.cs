using System;

namespace BadmintonApp.Application.DTOs.Role;

public class AssignRoleForUserDto
{
    public Guid UserId { get; set; }
    public Guid ClubId { get; set; }
    public Guid RoleId { get; set; }
}
