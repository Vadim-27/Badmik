using BadmintonApp.Application.DTOs.ErrorDtos;
using BadmintonApp.Application.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace BadmintonApp.API.Middlewares;

public class ExceptionMiddleware(RequestDelegate next) /*: IMiddleware*/
{
    public async Task InvokeAsync(HttpContext context, ILogger<ExceptionMiddleware> logger)
    {
        try
        {
            await next.Invoke(context);
        }
        catch (System.Exception ex)
        {
            logger.LogError(ex, "Error has happened with {RequestPath}, the message is: {Message}", context.Request.Path.Value, ex.Message);
            ErrorDto dto = new ErrorDto();

            switch (ex)
            {
                case AppException appException:
                    context.Response.StatusCode = appException.Code;
                    dto.Message = ex.Message;
                    break;
                default:
                    context.Response.StatusCode = 500;
                    dto.Message = "Internal Server Error..";
                    break;
            }
            await context.Response.WriteAsJsonAsync(dto);
        }

    }
}
