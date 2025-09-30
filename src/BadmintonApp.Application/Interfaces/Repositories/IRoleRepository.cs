using BadmintonApp.Domain.Core;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories;

public interface IRoleRepository
{
    Task AssignRoleForUser(Guid userId, Guid clubId, Guid roleId, CancellationToken cancellationToken);
    Task<List<Role>> GetAll(CancellationToken cancellationToken);
}
