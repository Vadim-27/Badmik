using BadmintonApp.Domain.Core;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Roles;

public interface IRoleService
{
    Task AssignRoleForStaff(Guid staffId, Guid clubId, Guid roleId, CancellationToken cancellationToken);
    Task<List<Role>> GetAll(Guid clubId, CancellationToken cancellationToken);
    Task RoleBindPermission(Guid userId, Guid clubId, Guid roleId, Guid permissionId, CancellationToken cancellationToken);
    Task RoleDeletePermission(Guid userId, Guid clubId, Guid roleId, Guid permissionId, CancellationToken cancellationToken);
    Task<List<Role>> GetRolesByStaffId(Guid staffId, CancellationToken cancellationToken);
}
