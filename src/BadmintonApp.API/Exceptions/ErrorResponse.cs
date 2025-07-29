using System.Collections.Generic;

namespace BadmintonApp.API.Exceptions
{
    public class ErrorResponse
    {
        public ErrorCode Code { get; set; } = default!;
        public string Message { get; set; } = default!;
        public IDictionary<string, string[]>? Details { get; set; } // optional
    }
}
