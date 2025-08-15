using Microsoft.Extensions.Logging;
using System;

namespace BadmintonApp.Domain.Logs;

public class Log
{
    public Guid Id { get; set; }
    public LogLevel Level { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Message { get; set; }
    public string ? ExceptionJson { get; set; }

}
