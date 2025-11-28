using AutoMapper;
using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Application.DTOs.WorkingHourDtos;
using BadmintonApp.Application.Interfaces.Clubs;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Clubs;
using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.WorkingHours;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services
{
    public class LocationService : ILocationService
    {
        private readonly ILocationsRepository _locationsRepository;
        private readonly IValidator<CreateLocationDto> _createLocationValidation;
        private readonly IValidator<UpdateLocationDto> _updateLocationValidation;
        private readonly IValidator<WorkingHourDto> _workingHourValidation;
        private readonly IMapper _mapper;
        private readonly ICourtsService _courtsService;

        public LocationService(ILocationsRepository locationsRepository,
        IValidator<CreateLocationDto> createLocationValidation,
        IValidator<UpdateLocationDto> updateLocationValidation,
        IValidator<WorkingHourDto> workingHourValidation,
        IMapper mapper,
        ICourtsService courtsService)
        {
            _locationsRepository = locationsRepository;
            _createLocationValidation = createLocationValidation;
            _updateLocationValidation = updateLocationValidation;
            _workingHourValidation = workingHourValidation;
            _mapper = mapper;
            _courtsService = courtsService;
        }

        public async Task<LocationResultDto> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default)
        {
            var entity = await _locationsRepository.GetByIdAsync(id, cancellationToken);
            if (entity is null)
            {
                throw new InvalidOperationException("Location not found.");
            }

            return _mapper.Map<LocationResultDto>(entity);
        }

        public async Task<List<LocationResultDto>> GetByClubIdAsync(
        Guid clubId,
        CancellationToken cancellationToken = default)
        {
            var entities = await _locationsRepository.GetByClubAsync(clubId, cancellationToken);
            return _mapper.Map<List<LocationResultDto>>(entities);
        }

        public async Task<LocationResultDto> CreateAsync(
        CreateLocationDto dto,
        CancellationToken cancellationToken = default)
        {
            await _createLocationValidation.ValidateAndThrowAsync(dto, cancellationToken);

            if (dto.WorkingHours is not null && dto.WorkingHours.Count > 0)
            {
                foreach (var wh in dto.WorkingHours)
                {
                    await _workingHourValidation.ValidateAndThrowAsync(wh, cancellationToken);
                }
            }
            
            var entity = _mapper.Map<Location>(dto);
            entity.Id = Guid.NewGuid();
            
            await _locationsRepository.AddAsync(entity, cancellationToken);

            // Sync courts for sports
            if (dto.Sports is not null && dto.Sports.Count > 0)
            {
                await _courtsService.SyncForLocationAsync(entity.Id, dto.Sports, cancellationToken);
            }

            var withCourts = await _locationsRepository.GetByIdAsync(entity.Id, cancellationToken);
            return _mapper.Map<LocationResultDto>(withCourts);
        }

        public async Task<LocationResultDto> UpdateAsync(
        Guid id,
        UpdateLocationDto dto,
        CancellationToken cancellationToken = default)
        {
            var entity = await _locationsRepository.GetByIdAsync(id, cancellationToken);
            if (entity is null)
            {
                throw new InvalidOperationException("Location not found.");
            }

            await _updateLocationValidation.ValidateAndThrowAsync(dto, cancellationToken);

            if (dto.WorkingHours is not null && dto.WorkingHours.Count > 0)
            {
                foreach (var wh in dto.WorkingHours)
                {
                    await _workingHourValidation.ValidateAndThrowAsync(wh, cancellationToken);
                }
            }

            _mapper.Map(dto, entity);
            await _locationsRepository.UpdateAsync(entity, cancellationToken);

            return _mapper.Map<LocationResultDto>(entity);
        }

        public async Task DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default)
        {
            var entity = await _locationsRepository.GetByIdAsync(id, cancellationToken);
            if (entity is null)
            {
                throw new InvalidOperationException("Location not found.");
            }

            await _locationsRepository.DeleteAsync(entity, cancellationToken);
        }
    }
}
