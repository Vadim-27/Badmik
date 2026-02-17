using BadmintonApp.Application.DTOs.Trainings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Trainings
{
    public interface ITrainingScheduleService
    {
        Task<Guid> CreateAsync(CreateOrUpdateScheduleDto dto, Guid createdByUserId, CancellationToken ct);
        Task UpdateAsync(Guid scheduleId, CreateOrUpdateScheduleDto dto, Guid updatedByUserId, CancellationToken ct);
        Task DeactivateAsync(Guid scheduleId, Guid updatedByUserId, CancellationToken ct);

        // Generate concrete sessions (instances) from schedules for a date range
        Task<int> GenerateWeeklySessionsAsync(Guid clubId, DateTime fromDate, DateTime toDate, Guid createdByUserId, CancellationToken ct);

        // Create one session from schedule (manual)
        Task<Guid> CreateSessionFromScheduleAsync(CreateSessionFromScheduleDto dto, Guid createdByUserId, CancellationToken ct);
    }
}
