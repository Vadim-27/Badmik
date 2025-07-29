using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace BadmintonApp.API.Exceptions
{
    public static class ExceptionFactory
    {
        // Factory method to create a not found response with a default message
        public static IActionResult NotFound(string message)
        {
            return new NotFoundObjectResult(new ErrorResponse
            {
                Code = ErrorCode.NotFound,
                Message = message
            });
        }

        // Factory method to create a not found response with an error code and message
        public static IActionResult ValidationFailed(IDictionary<string, string[]> details)
        {
            return new BadRequestObjectResult(new ErrorResponse
            {
                Code = ErrorCode.ValidationFailed,
                Message = "Validation failed",
                Details = details
            });
        }

        // Factory method to create a bad request response with an error code and message
        public static IActionResult BadRequest(ErrorCode errorCode, string message)
        {
            return new BadRequestObjectResult(new ErrorResponse
            {
                Code = errorCode,
                Message = message
            });
        }

        // Factory method to create a forbidden response
        public static IActionResult Forbidden(string message)
        {
            return new ObjectResult(new ErrorResponse
            {
                Code = ErrorCode.AccessDenied,
                Message = message
            })
            {
                StatusCode = StatusCodes.Status403Forbidden
            };
        }

        // Factory method to create a conflict response
        public static IActionResult Conflict(string message)
        {
            return new ConflictObjectResult(new ErrorResponse
            {
                Code = ErrorCode.Conflict,
                Message = message
            });
        }

        // Factory method to create an internal server error response
        public static IActionResult Internal(string message)
        {
            return new ObjectResult(new ErrorResponse
            {
                Code = ErrorCode.InternalError,
                Message = message
            })
            {
                StatusCode = StatusCodes.Status500InternalServerError
            };
        }

        // Factory method to create a generic error response
        public static IActionResult Create(
            ErrorCode code,
            string message,
            int statusCode = StatusCodes.Status400BadRequest,
            IDictionary<string, string[]>? details = null)
        {
            var error = new ErrorResponse
            {
                Code = code,
                Message = message,
                Details = details
            };

            return new ObjectResult(error) { StatusCode = statusCode };
        }
    }
}
