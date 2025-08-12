using AutoMapper;
using AutoMapper.QueryableExtensions;
using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Trainings;
using BadmintonApp.Application.Errors;
using BadmintonApp.Application.Exсeptions;
using BadmintonApp.Application.Interfaces.Permissions;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Application.Interfaces.Trainings;
using BadmintonApp.Domain.Permissions;
using BadmintonApp.Domain.Trainings;
using BadmintonApp.Domain.Trainings.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services;

public class TrainingsService : ITrainingsService
{
    private readonly ITrainingsRepository _repository;
    private readonly IMapper _mapper;
    private readonly IPermissionService _permission;
    private readonly IUserRepository _userRepository;

    public TrainingsService(ITrainingsRepository trainingsRepository, IMapper mapper, IPermissionService permission, IUserRepository userRepository)
    {
        _repository = trainingsRepository;
        _mapper = mapper;
        _permission = permission;
        _userRepository = userRepository;
    }

    public async Task<List<TrainingResultDto>> GetAllAsync(Guid clubId, DateTime? date = null, TrainingType? type = null, PlayerLevel? level = null, CancellationToken cancellationToken = default)
    { // Pagination ??

        var trainings = await _repository.GetAllAsync(clubId, date, type, level, cancellationToken);
        return trainings.ProjectTo<TrainingResultDto>(_mapper.ConfigurationProvider).ToList();

    }

    public async Task<TrainingResultDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var training = await _repository.GetByIdAsync(id, cancellationToken);
        return training == null ? null : _mapper.Map<TrainingResultDto>(training);
    }

    public async Task<TrainingResultDto> CreateAsync(Guid adminId, CreateTrainingDto dto, CancellationToken cancellationToken)
    {
        if (dto.Type == TrainingType.CourtRental && dto.TrainerId != null)
            throw new BadRequestException("CourtRental must not have a trainer");

        if (dto.Type == TrainingType.Individual && dto.MaxPlayers != 2)
            throw new BadRequestException("Individual training must have exactly 2 players");
        //if (dto.Type == TrainingType.CourtRental && dto.TrainerId != null)
        //    throw new ConflictException(ErrorCodes.Common.Conflict, "CourtRental must not have a trainer");

        //if (dto.Type == TrainingType.Individual && dto.MaxPlayers != 2)
        //    throw new ConflictException(ErrorCodes.Common.Conflict, "Individual training must have exactly 2 players");

        var user = await _userRepository.GetByIdAsync(adminId, cancellationToken);

        //if (user == null)
        //    throw new NotFoundException(ErrorCodes.Training.NotFound, "Admin user not found");

        if (!user.ClubId.HasValue)
            throw new Exception("User does not belong to any club");

        var training = _mapper.Map<Training>(dto);
        training.Id = Guid.NewGuid();
        training.ClubId = user.ClubId.Value;

        var result = await _repository.CreateAsync(training, cancellationToken);

        return _mapper.Map<TrainingResultDto>(result);
    }

    public async Task<ResultDto> CancelAsync(Guid trainingId, Guid userId, CancellationToken cancellationToken)
    {
        var training = await _repository.GetByIdAsync(trainingId, cancellationToken);
        if (training == null)
            return ResultDto.Fail<ResultDto>("Training not found");


        var participant = training.Participants.FirstOrDefault(p => p.UserId == userId);
        if (participant == null)
            return ResultDto.Fail<ResultDto>("You are not registered for this training");


        training.Participants.Remove(participant);

        if (training.Queue.Any())
        {
            var nextInLine = training.Queue.OrderBy(q => q.QueuedAt).First();
            training.Queue.Remove(nextInLine);

            training.Participants.Add(new TrainingParticipant
            {
                UserId = nextInLine.UserId,
                RegisteredAt = DateTime.UtcNow
            });
        }

        await _repository.UpdateAsync(training, cancellationToken);
        return ResultDto.Success<ResultDto>("Canceled successfully");
    }

    public async Task<ResultDto> JoinQueueAsync(Guid trainingId, Guid userId, CancellationToken cancellationToken)
    {
        var training = await _repository.GetByIdAsync(trainingId, cancellationToken);
        if (training == null)
            return ResultDto.Fail<ResultDto>("Training not found");

        if (training.Queue.Any(q => q.UserId == userId))
            return ResultDto.Fail<ResultDto>("You are already in queue");

        training.Queue.Add(new TrainingQueueEntry
        {
            UserId = userId,
            QueuedAt = DateTime.UtcNow
        });

        await _repository.UpdateAsync(training, cancellationToken);
        return ResultDto.Success<ResultDto>("Added to queue");
    }

    public async Task<ResultDto> LeaveQueueAsync(Guid trainingId, Guid userId, CancellationToken cancellationToken)
    {
        var training = await _repository.GetByIdAsync(trainingId, cancellationToken);
        if (training == null)
            return ResultDto.Fail<ResultDto>("Training not found");

        var queueEntry = training.Queue.FirstOrDefault(q => q.UserId == userId);
        if (queueEntry == null)
            return ResultDto.Fail<ResultDto>("You are not in queue");

        training.Queue.Remove(queueEntry);
        await _repository.UpdateAsync(training, cancellationToken);

        return ResultDto.Success<ResultDto>("Removed from queue");
    }

    public async Task<List<Guid>> GetParticipantsAsync(Guid trainingId, CancellationToken cancellationToken)
    {
        var training = await _repository.GetByIdAsync(trainingId, cancellationToken);
        return training?.Participants.Select(p => p.UserId).ToList() ?? new();
    }

    public async Task<List<Guid>> GetQueueAsync(Guid trainingId, CancellationToken cancellationToken)
    {
        var training = await _repository.GetByIdAsync(trainingId, cancellationToken);
        return training?.Queue.OrderBy(q => q.QueuedAt).Select(q => q.UserId).ToList() ?? new();
    }

    private bool IsLevelAllowed(Training training, PlayerLevel userLevel)
    {
        if (training.Type == TrainingType.CourtRental)
            return true;

        if (training.AllowedLevels == null || training.AllowedLevels.Count == 0)
            return false;

        return training.AllowedLevels.Contains(userLevel);
    }

    public async Task<TrainingResultDto> UpdateAsync(Guid id, UpdateTrainingDto dto, CancellationToken cancellationToken)
    {
        var existing = await _repository.GetByIdAsync(id, cancellationToken);
        if (existing == null)
            throw new Exception("Training not found");

        var hasAccess = await _permission.HasPermission(id, existing.ClubId, PermissionType.TrainingsManage);
        if (!hasAccess)
            throw new UnauthorizedAccessException("You do not have permission to modify this training");

        if (existing.Type == TrainingType.CourtRental && dto.TrainerId != null)
            throw new Exception("CourtRental must not have a trainer");

        if (existing.Type == TrainingType.Individual && dto.MaxPlayers != 2)
            throw new Exception("Individual training must have exactly 2 players");

        _mapper.Map(dto, existing);
        var updated = await _repository.UpdateAsync(existing, cancellationToken);
        return _mapper.Map<TrainingResultDto>(updated);
    }

    public async Task<ResultDto> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var training = await _repository.GetByIdAsync(id, cancellationToken);
        if (training == null)
            return ResultDto.Fail<ResultDto>("Training not found");

        var hasAccess = await _permission.HasPermission(id, training.ClubId, PermissionType.TrainingsManage);
        if (!hasAccess)
            return ResultDto.Fail<ResultDto>("Access denied");

        var success = await _repository.DeleteAsync(id, cancellationToken);
        return success
            ? ResultDto.Success<ResultDto>()
            : ResultDto.Fail<ResultDto>("Delete failed");
    }

    public async Task<ResultDto> RegisterAsync(Guid trainingId, Guid userId, PlayerLevel userLevel, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);

        var training = await _repository.GetByIdAsync(trainingId, cancellationToken);
        if (training == null)
            return ResultDto.Fail<ResultDto>("Training not found");

        if (!IsLevelAllowed(training, user.Level))
            return ResultDto.Fail<ResultDto>("Your level is not allowed");

        if (training.Participants.Any(p => p.UserId == userId))
            return ResultDto.Fail<ResultDto>("Already registered");

        var userTrainings = await _repository.GetTrainingsByUserAsync(userId, cancellationToken);

        var hasTimeConflict = userTrainings.Any(t =>
            t.Date.Date == training.Date.Date &&
            ((t.StartTime <= training.StartTime && training.StartTime < t.EndTime) ||
             (training.StartTime <= t.StartTime && t.StartTime < training.EndTime)));

        if (hasTimeConflict)
            return ResultDto.Fail<ResultDto>("You already have another training at this time");

        if (training.Participants.Count >= training.MaxPlayers)
        {
            if (!training.Queue.Any(q => q.UserId == userId))
            {
                training.Queue.Add(new TrainingQueueEntry
                {
                    UserId = userId,
                    QueuedAt = DateTime.UtcNow
                });
            }

            await _repository.UpdateAsync(training, cancellationToken);
            return ResultDto.Success<ResultDto>("Added to queue");
        }

        training.Participants.Add(new TrainingParticipant
        {
            UserId = userId,
            RegisteredAt = DateTime.UtcNow
        });

        await _repository.UpdateAsync(training, cancellationToken);
        return ResultDto.Success<ResultDto>("Registered successfully");
    }
}
