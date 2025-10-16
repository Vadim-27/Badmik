using BadmintonApp.Domain.WorkingHours;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories;

public interface IWorkingHourRepository
{
    Task AddWorkingHour(IEnumerable<WorkingHour> workingHour, CancellationToken cancellationToken);
}
