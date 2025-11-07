using BadmintonApp.Domain.Core;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories;

public interface IStaffRoleRepository
{
    Task<List<Role>> GetStaffRoleForClubAsync(Guid staffId, Guid clubId, CancellationToken cancellationToken);
}
