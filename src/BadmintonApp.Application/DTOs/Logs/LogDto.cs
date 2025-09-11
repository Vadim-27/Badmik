using Microsoft.Extensions.Logging;
using System;

namespace BadmintonApp.Application.DTOs.Logs;

public class LogDto
{
    public Guid Id { get; set; }
    public LogLevel Level { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Message { get; set; }
    public string? ExceptionJson { get; set; }
}
