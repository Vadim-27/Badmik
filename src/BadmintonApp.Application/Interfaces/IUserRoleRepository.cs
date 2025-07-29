using BadmintonApp.Domain.Permissions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces
{
    public interface IUserRoleRepository
    {
        Task<Role?> GetUserRoleForClubAsync(Guid userId, Guid clubId);
    }
}
