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
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly IPermissionRepository _permissionRepository;
        private readonly IMapper _mapper;

        public PermissionService(IUserRoleRepository userRoleRepository, IPermissionRepository permissionRepository, IMapper mapper)
        {
            _userRoleRepository = userRoleRepository;
            _permissionRepository = permissionRepository;
            _mapper = mapper;
        }
        public async Task<bool> HasPermission(Guid userId, Guid clubId, PermissionType permission, CancellationToken cancellationToken)
        {
            var role = await _userRoleRepository.GetUserRoleForClubAsync(userId, clubId, cancellationToken);           
            return  true;
        }
        public async Task<List<PermissionDto>> GetAll(CancellationToken cancellationToken)
        {
            List<Permission> result = await _permissionRepository.GetAll(cancellationToken);

            return _mapper.Map<List<PermissionDto>>(result);
        }
    }
}
