using BadmintonApp.Application.DTOs.Logs;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Logs;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;

namespace BadmintonApp.Infrastructure.Persistence.Repositories;

public class LogRepository : ILogRepository
{
    private readonly ApplicationDbContext _dbContext;

    public LogRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public IQueryable<Log> GetLogsByFilters(
        GetLogsFilterDto getLogsFilterDto,
        CancellationToken cancellationToken)
    {

        return _dbContext.Logs
             .AsNoTracking()
             .Where(x => (getLogsFilterDto.Level == null || x.Level == getLogsFilterDto.Level)
             &&
             (getLogsFilterDto.From <= x.CreatedAt && x.CreatedAt <= getLogsFilterDto.To));
    }


}
