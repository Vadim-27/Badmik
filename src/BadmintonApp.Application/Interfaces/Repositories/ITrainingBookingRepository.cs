using BadmintonApp.Domain.Trainings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories
{
    public interface ITrainingBookingRepository
    {
        Task<TrainingBooking?> GetByIdAsync(Guid id, CancellationToken ct);
        Task<TrainingBooking?> GetBySessionAndPlayerAsync(Guid trainingSessionId, Guid playerId, CancellationToken ct);

        Task<List<TrainingBooking>> GetBySessionAsync(Guid trainingSessionId, CancellationToken ct);
        Task<List<TrainingBooking>> GetByPlayerAsync(Guid playerId, DateTime? fromUtc, DateTime? toUtc, CancellationToken ct);

        Task CreateAsync(TrainingBooking booking, CancellationToken ct);
        Task UpdateAsync(TrainingBooking booking, CancellationToken ct);

        Task<bool> ExistsAsync(Guid trainingSessionId, Guid playerId, CancellationToken ct);
    }
}
