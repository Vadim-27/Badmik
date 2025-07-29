using BadmintonApp.Application.Interfaces;
using BadmintonApp.Domain.Permissions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services
{
    public class PermissionService : IPermissionService
    {
        private readonly IUserRoleRepository _userRoleRepository;

        public PermissionService(IUserRoleRepository userRoleRepository)
        {
            _userRoleRepository = userRoleRepository;
        }

        public async Task<bool> HasPermission(Guid userId, Guid clubId, PermissionType permission)
        {
            var role = await _userRoleRepository.GetUserRoleForClubAsync(userId, clubId);
            return role != null && role.Permissions.Contains(permission);
        }
    }
}
