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
    public class TrainingScheduleRepository : ITrainingScheduleRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public TrainingScheduleRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<TrainingSchedule?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _dbContext.TrainingSchedules
                .Include(x => x.Levels)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        }

        public async Task<List<TrainingSchedule>> GetActiveByClubAsync(Guid clubId, CancellationToken cancellationToken)
        {
            return await _dbContext.TrainingSchedules
                .Include(x => x.Levels)
                .AsNoTracking()
                .Where(x => x.ClubId == clubId && x.IsActive)
                .ToListAsync(cancellationToken);
        }

        public async Task CreateAsync(TrainingSchedule schedule, CancellationToken cancellationToken)
        {
            _dbContext.TrainingSchedules.Add(schedule);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }

        public async Task UpdateAsync(TrainingSchedule schedule, CancellationToken cancellationToken)
        {
            _dbContext.TrainingSchedules.Update(schedule);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
