using BadmintonApp.Application.DTOs.Trainings;
using BadmintonApp.Domain.Enums.Player;
using BadmintonApp.Domain.Enums.Training;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Trainings;

public interface ITrainingsService
{
    List<TrainingResultDto> GetAllAsync(Guid clubId, DateTime? date = null, TrainingType? type = null, PlayerLevel? level = null);
    Task<TrainingResultDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<TrainingResultDto> CreateAsync(Guid adminId, CreateTrainingDto dto, CancellationToken cancellationToken);
    Task<TrainingResultDto> UpdateAsync(Guid id, Guid userId, UpdateTrainingDto dto, CancellationToken cancellationToken);
    Task DeleteAsync(Guid id, Guid userId, CancellationToken cancellationToken);

    Task RegisterAsync(Guid trainingId, Guid userId, PlayerLevel userLevel, CancellationToken cancellationToken);
    Task CancelAsync(Guid trainingId, Guid userId, CancellationToken cancellationToken);


    Task<List<Guid>> GetParticipantsAsync(Guid trainingId, CancellationToken cancellationToken);
    Task<List<Guid>> GetQueueAsync(Guid trainingId, CancellationToken cancellationToken);
    Task JoinQueueAsync(Guid trainingId, Guid userId, CancellationToken cancellationToken);
    Task LeaveQueueAsync(Guid trainingId, Guid userId, CancellationToken cancellationToken);
}
