using AutoMapper;
using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Application.DTOs.WorkingHourDtos;
using BadmintonApp.Application.Exceptions;
using BadmintonApp.Application.Interfaces.Clubs;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Clubs;
using BadmintonApp.Domain.WorkingHours;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services;

public class ClubsService(
    IClubsRepository clubsRepository,
    IUserRepository userRepository,
    IValidator<CreateClubDto> createClubValidation,
    IValidator<WorkingHourDto> workingHourValidation,
    IValidator<UpdateClubDto> updateClubValidation,
    IWorkingHourRepository workingHourRepository,
    IMapper mapper) : IClubsService
{
    private readonly IClubsRepository _clubsRepository = clubsRepository;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IValidator<CreateClubDto> _createClubValidation = createClubValidation;
    private readonly IValidator<WorkingHourDto> _workingHourValidation = workingHourValidation;
    private readonly IValidator<UpdateClubDto> _updateClubValidation = updateClubValidation;
    private readonly IWorkingHourRepository _workingHourRepository = workingHourRepository;
    private readonly IMapper _mapper;

    public async Task<ClubResultDto> CreateAsync(
        CreateClubDto dto,
        CancellationToken cancellationToken)
    {
        // Validate incoming request
        await _createClubValidation.ValidateAndThrowAsync(dto, cancellationToken);

        // Map DTO → Entity
        var club = _mapper.Map<Club>(dto);

        // System fields
        club.Id = Guid.NewGuid();
        club.CreatedAt = DateTime.UtcNow;
        club.UpdatedAt = DateTime.UtcNow;
        club.IsActive = true;

        // Save to database
        club = await _clubsRepository.CreateAsync(club, cancellationToken);

        // Return mapped result
        return _mapper.Map<ClubResultDto>(club);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var club = await _clubsRepository.GetByIdAsync(id, cancellationToken);
        if (club is null) throw new BadRequestException("Club not found");

        await _clubsRepository.DeleteAsync(id, cancellationToken);
    }

    public async Task DeactivateAsync(Guid id, CancellationToken cancellationToken)
    {
        var club = await _clubsRepository.GetByIdAsync(id, cancellationToken);
        if (club == null)
            throw new KeyNotFoundException($"Club with id '{id}' was not found.");

        club.IsActive = false;
        club.UpdatedAt = DateTime.UtcNow;

        await _clubsRepository.UpdateAsync(club, cancellationToken);
    }

    public async Task ActivateAsync(Guid id, CancellationToken cancellationToken)
    {
        var club = await _clubsRepository.GetByIdAsync(id, cancellationToken);
        if (club == null)
            throw new KeyNotFoundException($"Club with id '{id}' was not found.");

        club.IsActive = true;
        club.UpdatedAt = DateTime.UtcNow;

        await _clubsRepository.UpdateAsync(club, cancellationToken);
    }

    public async Task<List<ClubResultDto>> GetAllAsync(
        string filter = null,
        CancellationToken cancellationToken = default)
    {
        var clubs = await _clubsRepository.GetAllAsync(filter, cancellationToken);
        return _mapper.Map<List<ClubResultDto>>(clubs);
    }

    public async Task<ClubResultDto> UpdateAsync(
        Guid id,
        UpdateClubDto dto,
        CancellationToken cancellationToken)
    {
        // Validate DTO
        await _updateClubValidation.ValidateAndThrowAsync(dto, cancellationToken);

        // Load entity
        var club = await _clubsRepository.GetByIdAsync(id, cancellationToken);
        if (club == null)
            throw new KeyNotFoundException($"Club with id '{id}' was not found.");

        // Map allowed fields from DTO → Entity (configured in mapping profile)
        _mapper.Map(dto, club);

        club.UpdatedAt = DateTime.UtcNow;

        await _clubsRepository.UpdateAsync(club, cancellationToken);

        return _mapper.Map<ClubResultDto>(club);
    }


}
