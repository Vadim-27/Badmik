using BadmintonApp.Application.DTOs.ErrorDtos;
using BadmintonApp.Application.Exсeptions;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace BadmintonApp.API.Middlewares;

public class ExceptionMiddleware /*: IMiddleware*/
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next.Invoke(context);
        }
        catch (System.Exception ex)
        {
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
