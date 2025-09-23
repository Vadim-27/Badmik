using BadmintonApp.Application.Exceptions;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Application.Interfaces.Roles;
using BadmintonApp.Domain.Core;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services;

public class RoleService : IRoleService 
{
    private readonly IRoleRepository _roleRepository;
    private readonly IClubsRepository _clubsRepository;
    private readonly IUserRepository _userRepository;

    public RoleService(IRoleRepository roleRepository, IClubsRepository clubsRepository, IUserRepository userRepository)
    {
        _roleRepository = roleRepository;
        _clubsRepository = clubsRepository;
        _userRepository = userRepository;
    }

    public async Task AssignRoleForUser(Guid userId, Guid clubId, Guid roleId, CancellationToken cancellationToken)
    {
        var club = await _clubsRepository.GetByIdAsync(clubId, cancellationToken);
        if (club == null) throw new BadRequestException("Club not found");

        var user = await _userRepository
            .GetByIdAsync(userId, cancellationToken);
        if (user == null) throw new BadRequestException("User not found");

        await _roleRepository.AssignRoleForUser(userId, clubId, roleId, cancellationToken);
    }

    public async Task<List<Role>> GetAll(CancellationToken cancellationToken)
    {
        return await _roleRepository.GetAll(cancellationToken);
    }
}
