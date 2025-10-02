using BadmintonApp.Domain.Core;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories;

public interface IUserRoleRepository
{
    Task<List<Role>> GetUserRoleForClubAsync(Guid userId, Guid clubId, CancellationToken cancellationToken);
}
