using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Trainings;
using BadmintonApp.Domain.Trainings.Enums;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Trainings;

public interface ITrainingsService
{
    Task<List<TrainingResultDto>> GetAllAsync(Guid clubId, DateTime? date = null, TrainingType? type = null, PlayerLevel? level = null, CancellationToken cancellationToken = default);
    Task<TrainingResultDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
    Task<TrainingResultDto> CreateAsync(Guid adminId, CreateTrainingDto dto, CancellationToken cancellationToken);
    Task<TrainingResultDto> UpdateAsync(Guid id, Guid userId, UpdateTrainingDto dto, CancellationToken cancellationToken);
    Task<ResultDto> DeleteAsync(Guid id, Guid userId, CancellationToken cancellationToken);

    Task<ResultDto> RegisterAsync(Guid trainingId, Guid userId, PlayerLevel userLevel, CancellationToken cancellationToken);
    Task<ResultDto> CancelAsync(Guid trainingId, Guid userId, CancellationToken cancellationToken);


    Task<List<Guid>> GetParticipantsAsync(Guid trainingId, CancellationToken cancellationToken);
    Task<List<Guid>> GetQueueAsync(Guid trainingId, CancellationToken cancellationToken);
    Task<ResultDto> JoinQueueAsync(Guid trainingId, Guid userId, CancellationToken cancellationToken);
    Task<ResultDto> LeaveQueueAsync(Guid trainingId, Guid userId, CancellationToken cancellationToken);
}
