using AutoMapper;
using BadmintonApp.Application.DTOs.Permisions;
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
        private readonly IStaffRoleRepository _staffRoleRepository;
        private readonly IPermissionRepository _permissionRepository;
        private readonly IMapper _mapper;

        public PermissionService(IStaffRoleRepository staffRoleRepository, IPermissionRepository permissionRepository, IMapper mapper)
        {
            _staffRoleRepository = staffRoleRepository;
            _permissionRepository = permissionRepository;
            _mapper = mapper;
        }
        public async Task<bool> HasPermission(Guid staffId, Guid clubId, PermissionType permission, CancellationToken cancellationToken)
        {
            var role = await _staffRoleRepository.GetStaffRoleForClubAsync(staffId, clubId, cancellationToken);           
            if (role == null || !role.Any())
            {
                return false;
            }
            var permissions = role.SelectMany(r => r.RolePermissions).Select(rp => rp.Permission.Type);
            if (!permissions.Contains(permission))
            {
                return false;
            }
            return  true;
        }
        public async Task<List<PermissionDto>> GetAll(CancellationToken cancellationToken)
        {
            List<Permission> result = await _permissionRepository.GetAll(cancellationToken);

            return _mapper.Map<List<PermissionDto>>(result);
        }
    }
}
