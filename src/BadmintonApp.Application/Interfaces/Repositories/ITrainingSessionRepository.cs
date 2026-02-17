using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Training;
using BadmintonApp.Domain.Trainings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories
{
    public interface ITrainingSessionRepository
    {
        Task<TrainingSession?> GetByIdAsync(Guid id, CancellationToken ct);

        Task CreateAsync(TrainingSession session, CancellationToken ct);

        // Avoid duplicates when generating from schedule
        Task<bool> ExistsAsync(Guid scheduleId, DateTime date, CancellationToken ct);
        Task<bool> ExistsForScheduleOnDateAsync(Guid clubId, Guid locationId, DateTime date, TimeOnly startTime, TimeOnly endTime, TrainingType type, SportType sportType, CancellationToken ct);

        Task<List<TrainingSession>> GetByClubAndDateRangeAsync(Guid clubId, DateTime fromDate, DateTime toDate, CancellationToken ct);
    }
}
