using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Core;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Repositories;

public class StaffRoleRepository : IStaffRoleRepository
{
    private readonly ApplicationDbContext _dbContext;

    public StaffRoleRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task<List<Role>> GetStaffRoleForClubAsync(Guid staffId, Guid clubId, CancellationToken cancellationToken)
    {
        var staffClubRoles = await _dbContext.StaffClubRoles
            .AsNoTracking()
            .Include(x => x.Role)
                .ThenInclude(x => x.RolePermissions)
                .ThenInclude(x => x.Permission)
            .Where(x => x.StaffId == staffId && x.ClubId == clubId)
            .Select(x => x.Role)
            .ToListAsync(cancellationToken);

        return staffClubRoles;
    }
}
