using Microsoft.AspNetCore.Http;

namespace BadmintonApp.Application.Exceptions;

public class ForbiddenException(string message) : AppException(StatusCodes.Status403Forbidden, message)
{
}
