using BadmintonApp.Application.DTOs.Logs;
using BadmintonApp.Domain.Logs;
using System.Linq;
using System.Threading;

namespace BadmintonApp.Application.Interfaces.Repositories;

public interface ILogRepository
{
    IQueryable<Log> GetLogsByFilters(
       GetLogsFilterDto getLogsFilterDto,
       CancellationToken cancellationToken);

}
