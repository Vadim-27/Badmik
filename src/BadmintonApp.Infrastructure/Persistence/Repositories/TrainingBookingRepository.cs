using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Trainings;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Repositories
{
    public class TrainingBookingRepository : ITrainingBookingRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public TrainingBookingRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<TrainingBooking?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _dbContext.TrainingBookings
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        }

        public async Task<TrainingBooking?> GetBySessionAndPlayerAsync(
            Guid trainingSessionId,
            Guid playerId,
            CancellationToken cancellationToken)
        {
            return await _dbContext.TrainingBookings
                .AsNoTracking()
                .FirstOrDefaultAsync(x =>
                    x.TrainingSessionId == trainingSessionId &&
                    x.PlayerId == playerId,
                    cancellationToken);
        }

        public async Task<List<TrainingBooking>> GetBySessionAsync(
            Guid trainingSessionId,
            CancellationToken cancellationToken)
        {
            return await _dbContext.TrainingBookings
                .AsNoTracking()
                .Where(x => x.TrainingSessionId == trainingSessionId)
                .OrderBy(x => x.CreatedAtUtc)
                .ToListAsync(cancellationToken);
        }

        public async Task<List<TrainingBooking>> GetByPlayerAsync(
            Guid playerId,
            DateTime? fromUtc,
            DateTime? toUtc,
            CancellationToken cancellationToken)
        {
            var query = _dbContext.TrainingBookings
                .AsNoTracking()
                .Where(x => x.PlayerId == playerId);

            if (fromUtc.HasValue)
                query = query.Where(x => x.CreatedAtUtc >= fromUtc.Value);

            if (toUtc.HasValue)
                query = query.Where(x => x.CreatedAtUtc <= toUtc.Value);

            return await query
                .OrderByDescending(x => x.CreatedAtUtc)
                .ToListAsync(cancellationToken);
        }

        public async Task CreateAsync(TrainingBooking booking, CancellationToken cancellationToken)
        {
            _dbContext.TrainingBookings.Add(booking);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(TrainingBooking booking, CancellationToken cancellationToken)
        {
            _dbContext.TrainingBookings.Update(booking);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<bool> ExistsAsync(
            Guid trainingSessionId,
            Guid playerId,
            CancellationToken cancellationToken)
        {
            return await _dbContext.TrainingBookings
                .AsNoTracking()
                .AnyAsync(x =>
                    x.TrainingSessionId == trainingSessionId &&
                    x.PlayerId == playerId,
                    cancellationToken);
        }
    }
}
