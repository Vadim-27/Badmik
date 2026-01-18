using BadmintonApp.Application.Exceptions;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Core;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Repositories;

public class RoleRepository : IRoleRepository
{
    private readonly ApplicationDbContext _context;

    public RoleRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task AssignRoleForStaff(Guid staffId, Guid clubId, Guid roleId, CancellationToken cancellationToken)
    {

        _context.StaffClubRoles.Add(new Domain.Core.StaffClubRole
        {
            RoleId = roleId,
            StaffId = staffId,
        });

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveRoleFromStaff(Guid staffId, Guid clubId, Guid roleId, CancellationToken cancellationToken)
    {
        var staffRole = await _context.StaffClubRoles.FirstOrDefaultAsync(x => x.StaffId == staffId && x.RoleId == roleId, cancellationToken);

        if (staffRole == null)
        {
            throw new NotFoundException("Staff role not found");
        }

        var rolesCount = await _context.StaffClubRoles
            .CountAsync(x =>
                x.StaffId == staffId,
                cancellationToken);
        if (rolesCount <= 1)
            throw new BadRequestException("Staff must have at least one role.");

        _context.StaffClubRoles.Remove(staffRole);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<Role>> GetAll(Guid clubId, CancellationToken cancellationToken)
    {
        var roles = await _context.Roles
            .AsNoTracking()
            .Where(r => r.ClubId == null || r.ClubId == clubId)
            .OrderBy(r => r.Name)
            .ToListAsync(cancellationToken);

        return roles;
    }


    public async Task RoleBindPermission(Guid roleId, Guid permissionId, CancellationToken cancellationToken)
    {        

        var rolePermision = new RolePermission
        {
            RoleId = roleId,
            PermissionId = permissionId
        };

        await _context.RolePermissions.AddAsync(rolePermision, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> IsExist(Guid roleId, Guid permissionId, CancellationToken cancellationToken)
    {
        return await _context.RolePermissions
            .AnyAsync(x => x.RoleId == roleId && x.PermissionId == permissionId, cancellationToken);        
    }

    public async Task RoleDeletePermission(Guid roleId, Guid permissionId, CancellationToken cancellationToken)
    {
        var rolePermission = await _context.RolePermissions.FirstAsync(x => x.RoleId == roleId && x.PermissionId == permissionId, cancellationToken);

        _context.RolePermissions.Remove(rolePermission);

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<Role>> GetRolesByStaffId(Guid id, CancellationToken cancellationToken)
    {
        List<Role> roles = await _context.Roles
            .AsNoTracking()
            .Where(x => x.Name != "SuperAdmin")
            .ToListAsync(cancellationToken);
        return roles;
    }
}
