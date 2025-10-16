using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.WorkingHours;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Repositories;

public class WorkingHourRepository : IWorkingHourRepository
{
    private readonly ApplicationDbContext _dbContext;

    public WorkingHourRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task AddWorkingHour(IEnumerable<WorkingHour> workingHour, CancellationToken cancellationToken)
    {
        await _dbContext.WorkingHours.AddRangeAsync(workingHour, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
