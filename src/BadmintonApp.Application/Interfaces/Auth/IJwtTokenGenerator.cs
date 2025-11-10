using BadmintonApp.Domain.Core;

namespace BadmintonApp.Application.Interfaces.Auth;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user, PermissionType[] permissions);
}
