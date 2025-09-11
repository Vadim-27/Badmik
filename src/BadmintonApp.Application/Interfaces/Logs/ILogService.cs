using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Logs;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Logs;

public interface ILogService
{
    public Task<PaginationListDto<LogDto>> GetLogsByFilters(
        GetLogsFilterDto getLogsFilterDto,
        CancellationToken cancellationToken);

}
