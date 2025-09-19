using BadmintonApp.Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Auth
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(User user, string role);
    }
}
