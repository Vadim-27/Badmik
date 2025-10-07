using AutoMapper;
using AutoMapper.QueryableExtensions;
using BadmintonApp.Application.DTOs.Trainings;
using BadmintonApp.Application.Exceptions;
using BadmintonApp.Application.Interfaces.Permissions;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Application.Interfaces.Trainings;
using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.Trainings;
using BadmintonApp.Domain.Trainings.Enums;
using FluentValidation;
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
    private readonly IValidator<CreateTrainingDto> _createTrainingValidation;
    private readonly IValidator<UpdateTrainingDto> _updateTrainingValidation;

    public TrainingsService(ITrainingsRepository trainingsRepository, IMapper mapper, IPermissionService permission, IUserRepository userRepository, IValidator<CreateTrainingDto> createTrainingValidation, IValidator<UpdateTrainingDto> updateTrainingValidation)
    {
        _repository = trainingsRepository;
        _mapper = mapper;
        _permission = permission;
        _userRepository = userRepository;
        _createTrainingValidation = createTrainingValidation;
        _updateTrainingValidation = updateTrainingValidation;
    }

    public  List<TrainingResultDto> GetAllAsync(Guid clubId, DateTime? date = null, TrainingType? type = null, PlayerLevel? level = null)
    { // Pagination ??

        var trainings =  _repository.GetAllAsync(clubId, date, type, level);
        return trainings.ProjectTo<TrainingResultDto>(_mapper.ConfigurationProvider).ToList();

    }

    public async Task<TrainingResultDto> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        var training = await _repository.GetByIdAsync(id, cancellationToken) ?? throw new NotFoundException("Training not found");

        return _mapper.Map<TrainingResultDto>(training);
    }

    public async Task<TrainingResultDto> CreateAsync(Guid adminId, CreateTrainingDto dto, CancellationToken cancellationToken)
    {
        await _createTrainingValidation.ValidateAndThrowAsync(dto, cancellationToken);               

        var user = await _userRepository.GetByIdAsync(adminId, cancellationToken);        

        if (!user.ClubId.HasValue)
            throw new BadRequestException("User does not belong to any club");

        var training = _mapper.Map<Training>(dto);
        training.Id = Guid.NewGuid();
        training.ClubId = user.ClubId.Value;

        var result = await _repository.CreateAsync(training, cancellationToken);

        return _mapper.Map<TrainingResultDto>(result);
    }

    public async Task CancelAsync(Guid trainingId, Guid userId, CancellationToken cancellationToken)
    {
        var training = await _repository.GetByIdAsync(trainingId, cancellationToken);
        if (training == null)
            throw new NotFoundException("Training not found");

        var participant = training.Participants.FirstOrDefault(p => p.UserId == userId);
        if (participant == null)
            throw new BadRequestException("You are not registered for this training");

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
    }

    public async Task JoinQueueAsync(Guid trainingId, Guid userId, CancellationToken cancellationToken)
    {
        var training = await _repository.GetByIdAsync(trainingId, cancellationToken);
        if (training == null)
            throw new NotFoundException("Training not found");

        if (training.Queue.Any(q => q.UserId == userId))
            throw new BadRequestException("You are already in queue");

        training.Queue.Add(new TrainingQueueEntry
        {
            UserId = userId,
            QueuedAt = DateTime.UtcNow
        });

        await _repository.UpdateAsync(training, cancellationToken);
    }

    public async Task LeaveQueueAsync(Guid trainingId, Guid userId, CancellationToken cancellationToken)
    {
        var training = await _repository.GetByIdAsync(trainingId, cancellationToken);
        if (training == null)
            throw new NotFoundException("Training not found");

        var queueEntry = training.Queue.FirstOrDefault(q => q.UserId == userId);
        if (queueEntry == null)
            throw new BadRequestException("You are not in queue");

        training.Queue.Remove(queueEntry);
        await _repository.UpdateAsync(training, cancellationToken);
    }

    public async Task<List<Guid>> GetParticipantsAsync(Guid trainingId, CancellationToken cancellationToken)
    {
        var training = await _repository.GetByIdAsync(trainingId, cancellationToken);
        return training?.Participants.Select(p => p.UserId).ToList() ?? new();

        // чи потрібно повертати об'єкти учасників/юзерів, чи залишити повернення гуід (узгодити з фронтом та бізнесом)
    }

    public async Task<List<Guid>> GetQueueAsync(Guid trainingId, CancellationToken cancellationToken)
    {
        var training = await _repository.GetByIdAsync(trainingId, cancellationToken);
        return training?.Queue.OrderBy(q => q.QueuedAt).Select(q => q.UserId).ToList() ?? new();

        // чи потрібно повертати об'єкти учасників/юзерів, чи залишити повернення гуід (узгодити з фронтом та бізнесом)
    }

    private bool IsLevelAllowed(Training training, PlayerLevel userLevel)
    {
        if (training.Type == TrainingType.CourtRental)
            return true;        

        return training.AllowedLevels?.Contains(userLevel) ?? false;
    }

    public async Task<TrainingResultDto> UpdateAsync(Guid id, Guid userId, UpdateTrainingDto dto, CancellationToken cancellationToken)
    {
        var existing = await _repository.GetByIdAsync(id, cancellationToken);
        if (existing == null)
            throw new NotFoundException("Training not found");

        var hasAccess = await _permission.HasPermission(userId, existing.ClubId, PermissionType.TrainingsManage, cancellationToken);
        if (!hasAccess)
            throw new ForbiddenException("You do not have permission to modify this training");

        await _updateTrainingValidation.ValidateAndThrowAsync(dto, cancellationToken);

        existing = _mapper.Map<Training>(dto);

        var updated = await _repository.UpdateAsync(existing, cancellationToken);
        return _mapper.Map<TrainingResultDto>(updated);
    }

    public async Task DeleteAsync(Guid id, Guid userId, CancellationToken cancellationToken)
    {
        var training = await _repository.GetByIdAsync(id, cancellationToken);
        if (training == null) throw new NotFoundException("Training not found");            

        var hasAccess = await _permission.HasPermission(userId, training.ClubId, PermissionType.TrainingsManage, cancellationToken);
        if (!hasAccess) throw new ForbiddenException("Access denied");

        await _repository.DeleteAsync(id, cancellationToken); 
    }

    public async Task RegisterAsync(Guid trainingId, Guid userId, PlayerLevel userLevel, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByIdAsync(userId, cancellationToken);

        var training = await _repository.GetByIdAsync(trainingId, cancellationToken);

        if (training == null) throw new NotFoundException("Training not found");

        //if (!IsLevelAllowed(training, user.Level))
        //    throw new BadRequestException("Your level is not allowed");

        if (training.Participants.Any(p => p.UserId == userId))
            throw new BadRequestException("Already registered");

        var userTrainings = await _repository.GetTrainingsByUserAsync(userId, cancellationToken);

        var hasTimeConflict = userTrainings.Any(t =>
            t.Date.Date == training.Date.Date &&
            ((t.StartTime <= training.StartTime && training.StartTime < t.EndTime) ||
             (training.StartTime <= t.StartTime && t.StartTime < training.EndTime)));

        if (hasTimeConflict)
            throw new BadRequestException("You already have another training at this time");

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
        }

        training.Participants.Add(new TrainingParticipant
        {
            UserId = userId,
            RegisteredAt = DateTime.UtcNow
        });

        await _repository.UpdateAsync(training, cancellationToken);
    }
}
