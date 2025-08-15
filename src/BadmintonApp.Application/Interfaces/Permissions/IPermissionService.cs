using BadmintonApp.Domain.Permissions;
using System;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Permissions
{
    public interface IPermissionService
    {
        Task<bool> HasPermission(Guid userId, Guid clubId, PermissionType permission);
    }
}
