using BadmintonApp.Domain.Core;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories;

public interface IRoleRepository
{
    Task AssignRoleForStaff(Guid userId, Guid clubId, Guid roleId, CancellationToken cancellationToken);
    Task<List<Role>> GetAll(Guid clubId, CancellationToken cancellationToken);
    Task RoleBindPermission(Guid roleId, Guid permissionId, CancellationToken cancellationToken);
    Task<bool> IsExist(Guid roleId, Guid permissionId, CancellationToken cancellationToken);
    Task RoleDeletePermission(Guid roleId, Guid permissionId, CancellationToken cancellationToken);
    Task<List<Role>> GetRolesByStaffId(Guid staffId, CancellationToken cancellationToken);

}
