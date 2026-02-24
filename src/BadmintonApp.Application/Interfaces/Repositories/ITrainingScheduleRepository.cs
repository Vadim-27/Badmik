using BadmintonApp.Domain.Trainings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories
{
    public interface ITrainingScheduleRepository
    {
        Task<TrainingSchedule?> GetByIdAsync(Guid id, CancellationToken ct);
        Task CreateAsync(TrainingSchedule schedule, CancellationToken ct);
        Task UpdateAsync(TrainingSchedule schedule, CancellationToken ct);

        Task<List<TrainingSchedule>> GetActiveByClubAsync(Guid clubId, CancellationToken ct);
    }
}
