using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Training;
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
    public class TrainingSessionRepository : ITrainingSessionRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public TrainingSessionRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<TrainingSession?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _dbContext.TrainingSessions
                .Include(x => x.Levels)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        }

        public async Task<List<TrainingSession>> GetByClubAndDateRangeAsync(
            Guid clubId,
            DateTime fromDate,
            DateTime toDate,
            CancellationToken cancellationToken)
        {
            var from = fromDate.Date;
            var to = toDate.Date;

            return await _dbContext.TrainingSessions
                .Include(x => x.Levels)
                .AsNoTracking()
                .Where(x => x.ClubId == clubId
                            && x.Date >= from
                            && x.Date <= to)
                .OrderBy(x => x.Date)
                .ThenBy(x => x.StartTime)
                .ToListAsync(cancellationToken);
        }

        public async Task CreateAsync(TrainingSession session, CancellationToken cancellationToken)
        {
            _dbContext.TrainingSessions.Add(session);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(TrainingSession session, CancellationToken cancellationToken)
        {
            _dbContext.TrainingSessions.Update(session);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task<bool> ExistsAsync(
            Guid sessionId, DateTime date,
            CancellationToken cancellationToken)
        {
            
            return await _dbContext.TrainingSessions
                .AsNoTracking()
                .AnyAsync(x =>
                    x.Id == sessionId && x.Date == date,
                    cancellationToken);
        }

        public async Task<bool> ExistsForScheduleOnDateAsync(
            Guid clubId,
            Guid locationId,
            DateTime date,
            TimeOnly startTime,
            TimeOnly endTime,
            TrainingType type,
            SportType sportType,
            CancellationToken cancellationToken)
        {
            var d = date.Date;

            return await _dbContext.TrainingSessions
                .AsNoTracking()
                .AnyAsync(x =>
                    x.ClubId == clubId &&
                    x.LocationId == locationId &&
                    x.Date == d &&
                    x.StartTime == startTime &&
                    x.EndTime == endTime &&
                    x.Type == type,
                    cancellationToken);
        }
    }
}
