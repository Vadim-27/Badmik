using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Logs;
using BadmintonApp.Domain.Logs;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories;

public interface ILogRepository
{
    Task<List<Log>> GetLogsByFilters(
       GetLogsFilterDto getLogsFilterDto,
       CancellationToken cancellationToken);
    Task<int> GetTotalCountLogsByFilter(
       GetLogsFilterDto getLogsFilterDto,
       CancellationToken cancellationToken);
}
