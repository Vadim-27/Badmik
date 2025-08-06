using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Permissions;
using System;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Repositories;

public class UserRoleRepository : IUserRoleRepository
{
    public Task<Role> GetUserRoleForClubAsync(Guid userId, Guid clubId)
    {
        throw new NotImplementedException();
    }
}
