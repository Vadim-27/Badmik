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
    public async Task AssignRoleForUser(Guid userId, Guid clubId, Guid roleId, CancellationToken cancellationToken)
    {

        _context.UserClubRoles.Add(new Domain.Core.UserClubRole
        {
            ClubId = clubId,
            RoleId = roleId,
            UserId = userId,
        });

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<Role>> GetAll(CancellationToken cancellationToken)
    {
        List<Role> roles = await _context.Roles
            .AsNoTracking()
            .Where(x => x.Name != "SuperAdmin")
            .ToListAsync(cancellationToken);
        return roles;
    }
}
