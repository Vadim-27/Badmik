using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Core;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Repositories;

public class UserRoleRepository : IUserRoleRepository
{
    private readonly ApplicationDbContext _dbContext;

    public UserRoleRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task<List<Role>> GetUserRoleForClubAsync(Guid userId, Guid clubId, CancellationToken cancellationToken)
    {
        var userClubRoles = await _dbContext.UserClubRoles
            .AsNoTracking()
            .Include(x => x.Role)
                .ThenInclude(x => x.RolePermissions)
                .ThenInclude(x => x.Permission)
            .Where(x => x.UserId == userId && x.ClubId == clubId)
            .Select(x => x.Role)
            .ToListAsync(cancellationToken);

       var globalUserRoles =  await _dbContext.UserRoles
            .AsNoTracking()
            .Include(x => x.Role)
                .ThenInclude(x => x.RolePermissions)
                .ThenInclude(x => x.Permission)
            .Where(x => x.UserId == userId)
            .Select( x => x.Role)
            .ToListAsync(cancellationToken);

        userClubRoles.AddRange(globalUserRoles);

        return userClubRoles;
    }
}
