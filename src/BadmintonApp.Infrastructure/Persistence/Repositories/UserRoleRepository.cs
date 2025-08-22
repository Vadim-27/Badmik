using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Permissions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Repositories;

public class UserRoleRepository : IUserRoleRepository
{
    private readonly ApplicationDbContext _dbContext;

    public UserRoleRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task<Role> GetUserRoleForClubAsync(Guid userId, Guid clubId)
    {

        var userRole = await _dbContext.UserClubRoles
            .AsNoTracking()
            .Where(x => x.UserId == userId && x.ClubId == clubId)
            .FirstAsync();

        return await _dbContext.Roles
            .AsNoTracking()
            .Where(x => x.Type == userRole.Role)
          //.Include(x => x.Permissions)
            .FirstOrDefaultAsync();
    }
}
