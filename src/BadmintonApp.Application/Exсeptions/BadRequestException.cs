using Microsoft.AspNetCore.Http;

namespace BadmintonApp.Application.Exceptions;

public class BadRequestException : AppException
{
    public BadRequestException(string message) : base (StatusCodes.Status400BadRequest, message)
    {
        
    }
}
