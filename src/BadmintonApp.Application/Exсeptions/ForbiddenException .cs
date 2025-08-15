using Microsoft.AspNetCore.Http;

namespace BadmintonApp.Application.Exсeptions;

public class ForbiddenException : AppException
{
    public ForbiddenException(string message) : base(StatusCodes.Status403Forbidden, message)
    {

    }
}
