using BadmintonApp.Application.Exceptions;
using BadmintonApp.Application.Interfaces.Permissions;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Application.Interfaces.Roles;
using BadmintonApp.Domain.Core;
using System;
using System.Collections.Generic;
using System.Security;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services;

public class RoleService : IRoleService
{
    private readonly IRoleRepository _roleRepository;
    private readonly IClubsRepository _clubsRepository;
    private readonly IUserRepository _userRepository;
    private readonly IPermissionService _permission;

    public RoleService(IRoleRepository roleRepository, IPermissionService permission, IClubsRepository clubsRepository, IUserRepository userRepository)
    {
        _roleRepository = roleRepository;
        _clubsRepository = clubsRepository;
        _userRepository = userRepository;
        _permission = permission;
    }

    public async Task AssignRoleForUser(Guid userId, Guid clubId, Guid roleId, CancellationToken cancellationToken)
    {
        var club = await _clubsRepository.GetByIdAsync(clubId, cancellationToken);
        if (club == null) throw new BadRequestException("Club not found");

        var user = await _userRepository
            .GetByIdAsync(userId, cancellationToken);
        if (user == null) throw new BadRequestException("User not found");

        await _roleRepository.AssignRoleForStaff(userId, clubId, roleId, cancellationToken);
    }

    public async Task<List<Role>> GetAll(Guid clubId, CancellationToken cancellationToken)
    {
        return await _roleRepository.GetAll(clubId, cancellationToken);
    }

    public async Task RoleBindPermission(Guid roleId, Guid permissionId, CancellationToken cancellationToken)
    {

        if (await _roleRepository.IsExist(roleId, permissionId, cancellationToken))
        {
            throw new BadRequestException("Role already has permission.");
        }
            await _roleRepository.RoleBindPermission(roleId, permissionId, cancellationToken);
    }

    public async Task RoleDeletePermission(Guid roleId, Guid permissionId, CancellationToken cancellationToken)
    {
        if (await _roleRepository.IsExist(roleId, permissionId, cancellationToken))
        {
            throw new BadRequestException("Role has not permission.");
        }
        await _roleRepository.RoleDeletePermission(roleId, permissionId, cancellationToken);
    }

    public async Task<List<Role>> GetRolesByStaffId(Guid staffId, Guid clubId, CancellationToken cancellationToken)
    {
        var hasAccess = await _permission.HasPermission(staffId, clubId, PermissionType.RolesView, cancellationToken);
        if (!hasAccess)
            throw new ForbiddenException("You do not have permission to see roles");

        return await _roleRepository.GetRolesByStaffId(staffId, cancellationToken);
    }
}
