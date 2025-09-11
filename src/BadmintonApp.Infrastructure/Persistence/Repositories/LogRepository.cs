using BadmintonApp.Application.DTOs.Logs;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Logs;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Repositories;

public class LogRepository : ILogRepository
{
    private readonly ApplicationDbContext _dbContext;

    public LogRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Log>> GetLogsByFilters(
        GetLogsFilterDto getLogsFilterDto,
        CancellationToken cancellationToken)
    {
        return await GetLogsQueryByFilter(getLogsFilterDto)
             .Skip((getLogsFilterDto.Page - 1) * getLogsFilterDto.PageSize)
             .Take(getLogsFilterDto.PageSize)
             .ToListAsync(cancellationToken);
    }

    public async Task<int> GetTotalCountLogsByFilter(
        GetLogsFilterDto getLogsFilterDto,
        CancellationToken cancellationToken)
    {
             return await GetLogsQueryByFilter(getLogsFilterDto)
             .CountAsync(cancellationToken);
    }

    private IQueryable<Log> GetLogsQueryByFilter(GetLogsFilterDto getLogsFilterDto)
    {
        return _dbContext.Logs
             .AsNoTracking()
             .Where(x => (getLogsFilterDto.Level == null || x.Level == getLogsFilterDto.Level)
             &&
             (getLogsFilterDto.From <= x.CreatedAt && x.CreatedAt <= getLogsFilterDto.To));
    }
}
