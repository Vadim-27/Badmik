using BadmintonApp.Application.DTOs.Permisions;
using BadmintonApp.Domain.Core;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Permissions
{
    public interface IPermissionService
    {
        Task<bool> HasPermission(Guid userId, Guid clubId, PermissionType permission, CancellationToken cancellationToken);
        Task<List<PermissionDto>> GetAll(CancellationToken cancellationToken);
        
    }
}
