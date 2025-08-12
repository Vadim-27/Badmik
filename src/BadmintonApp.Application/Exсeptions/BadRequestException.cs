using Microsoft.AspNetCore.Http;

namespace BadmintonApp.Application.Exсeptions;

public class BadRequestException : AppException
{
    public BadRequestException(string message) : base (StatusCodes.Status400BadRequest, message)
    {
        
    }
}
