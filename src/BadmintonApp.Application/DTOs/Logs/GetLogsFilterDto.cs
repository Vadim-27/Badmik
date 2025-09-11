using BadmintonApp.Application.DTOs.Common;
using Microsoft.Extensions.Logging;
using System;

namespace BadmintonApp.Application.DTOs.Logs;

public class GetLogsFilterDto : PaginationFilterDto
{
    public DateTime From { get; set; }
    public DateTime To { get; set; }
    public LogLevel? Level { get; set; }
}
