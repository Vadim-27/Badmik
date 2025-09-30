using BadmintonApp.Domain.Core;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories;

public interface IPermissionRepository
{
    Task<List<Permission>> GetAll(CancellationToken cancellationToken);
}
