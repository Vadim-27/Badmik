using BadmintonApp.Application.Interfaces.Permissions;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services
{
    public class PermissionService : IPermissionService
    {
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly IPermissionRepository _permissionRepository;

        public PermissionService(IUserRoleRepository userRoleRepository, IPermissionRepository permissionRepository)
        {
            _userRoleRepository = userRoleRepository;
            _permissionRepository = permissionRepository;
        }
        public async Task<bool> HasPermission(Guid userId, Guid clubId, PermissionType permission, CancellationToken cancellationToken)
        {
            var role = await _userRoleRepository.GetUserRoleForClubAsync(userId, clubId, cancellationToken);           
            return  true;
        }
        public async Task<List<Permission>> GetAll(CancellationToken cancellationToken)
        {
            List<Permission> result = await _permissionRepository.GetAll(cancellationToken);
            return result;
        }
    }
}
