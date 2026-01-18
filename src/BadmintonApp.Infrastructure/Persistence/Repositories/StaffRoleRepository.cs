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
        return await _dbContext.StaffClubRoles
            .AsNoTracking()
            .Where(x => x.StaffId == staffId && x.Staff.ClubId == clubId)
            .Select(x => x.Role)
            .Where(r => r.ClubId == null || r.ClubId == clubId)
            .Include(r => r.RolePermissions)
                .ThenInclude(rp => rp.Permission)
            .ToListAsync(cancellationToken);
    }
}
