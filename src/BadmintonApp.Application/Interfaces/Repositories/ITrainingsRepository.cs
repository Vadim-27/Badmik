using BadmintonApp.Domain.Trainings;
using BadmintonApp.Domain.Trainings.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories;

public interface ITrainingsRepository
{    
    IQueryable<Training> GetAllAsync(Guid clubId, DateTime? date = null, TrainingType? type = null, PlayerLevel? level = null);
    Task<Training?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<Training> CreateAsync(Training training, CancellationToken cancellationToken);
    Task<Training> UpdateAsync(Training training, CancellationToken cancellationToken);
    Task<List<Training>> GetTrainingsByUserAsync(Guid userId, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
}
