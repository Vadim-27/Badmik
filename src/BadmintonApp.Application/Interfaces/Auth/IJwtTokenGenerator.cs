using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.Enums.Permission;

namespace BadmintonApp.Application.Interfaces.Auth;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user, PermissionType[] permissions);
}
