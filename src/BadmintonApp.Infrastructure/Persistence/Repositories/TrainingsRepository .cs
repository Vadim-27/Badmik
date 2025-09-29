using BadmintonApp.Application.Exceptions;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Trainings;
using BadmintonApp.Domain.Trainings.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Repositories;

public class TrainingsRepository : ITrainingsRepository
{
    private readonly ApplicationDbContext _dbContext;

    public TrainingsRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task<Training> CreateAsync(Training training, CancellationToken cancellationToken)
    {
        await _dbContext.AddAsync(training, cancellationToken);

        await _dbContext.SaveChangesAsync(cancellationToken);
        return training;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Trainings.FirstAsync(x =>x.Id == id, cancellationToken);

        _dbContext.Remove(entity);
        return await _dbContext.SaveChangesAsync(cancellationToken) > 0;
    }
     
    public async Task<Training> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _dbContext.Trainings
            .AsNoTracking()
            .Include(x => x.Participants)
            .Include(x => x.Queue)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<Training> UpdateAsync(Training training, CancellationToken cancellationToken)
    {
        _dbContext.Update(training);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return training;
    }

    public async Task<List<Training>> GetTrainingsByUserAsync(Guid userId, CancellationToken cancellationToken)
    {
        return await _dbContext.Trainings
            .AsNoTracking()
            .Include(x => x.Participants)
            .Where(t => t.Participants.Any(p => p.UserId == userId))
            .ToListAsync(cancellationToken);
    }

    public IQueryable<Training> GetAllAsync(Guid clubId, DateTime? date, TrainingType? type, PlayerLevel? level)
    {
        var query = _dbContext.Trainings.AsNoTracking();

        query = query.Where(x => x.ClubId == clubId);

        if (date.HasValue)
            query = query.Where(x => x.Date.Date == date.Value.Date);

        if (type.HasValue)
            query = query.Where(x => x.Type == type);

        if (level.HasValue)

            query = query
                .Include(x => x.AllowedLevels)
                .Where(x => x.AllowedLevels.Contains(level.Value));

        return query
            .Include(x => x.Participants)
            .Include(x => x.Queue);
            
    }
}
