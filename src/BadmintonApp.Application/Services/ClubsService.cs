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
    IWorkingHourRepository workingHourRepository) : IClubsService
{
    private readonly IClubsRepository _clubsRepository = clubsRepository;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IValidator<CreateClubDto> _createClubValidation = createClubValidation;
    private readonly IValidator<WorkingHourDto> _workingHourValidation = workingHourValidation;
    private readonly IValidator<UpdateClubDto> _updateClubValidation = updateClubValidation;
    private readonly IWorkingHourRepository _workingHourRepository = workingHourRepository;

    public async Task<ClubResultDto> CreateAsync(CreateClubDto dto, CancellationToken cancellationToken)
    {
        await _createClubValidation.ValidateAndThrowAsync(dto, cancellationToken);

        await _workingHourValidation.ValidateAndThrowAsync(dto.WorkingHours, cancellationToken);


        var club = new Club
        {
            Id = Guid.NewGuid(), //?
            Address = dto.Location.Address,
            City = dto.Location.City,
            Name = dto.Name,
            TotalCourts = dto.CourtCount,

        };
        var workingHours = new List<WorkingHour>()
            {
                CreateWorkingHour(DayOfWeek.Monday, dto.WorkingHours.Monday),
                CreateWorkingHour(DayOfWeek.Tuesday, dto.WorkingHours.Tuesday),
                CreateWorkingHour(DayOfWeek.Wednesday, dto.WorkingHours.Wednesday),
                CreateWorkingHour(DayOfWeek.Thursday, dto.WorkingHours.Thursday),
                CreateWorkingHour(DayOfWeek.Friday, dto.WorkingHours.Friday),
                CreateWorkingHour(DayOfWeek.Saturday, dto.WorkingHours.Saturday),
                CreateWorkingHour(DayOfWeek.Sunday, dto.WorkingHours.Sunday),
            }.Where(x => x != null).ToList();

        workingHours.ForEach(x => x.ClubId = club.Id);

        await _workingHourRepository.AddWorkingHour(workingHours, cancellationToken);

        var clubRes = await _clubsRepository.CreateAsync(club, cancellationToken);

        return MapToClub(clubRes);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var club = await _clubsRepository.GetByIdAsync(id, cancellationToken);
        if (club is null) throw new BadRequestException("Club not found");

        await _clubsRepository.DeleteAsync(id, cancellationToken);
    }

    public async Task<List<ClubResultDto>> GetAllAsync(string filter = null, CancellationToken cancellationToken = default)
    {

        var clubs = await _clubsRepository.GetAllAsync(cancellationToken: cancellationToken);
        return clubs.Select(MapToClub).ToList(); // переробити на автомапер (!!!)
    }

    public async Task<ClubResultDto> UpdateAsync(Guid id, UpdateClubDto dto, CancellationToken cancellationToken)
    {
        await _updateClubValidation.ValidateAndThrowAsync(dto, cancellationToken);
        await _workingHourValidation.ValidateAndThrowAsync(dto.WorkingHours, cancellationToken);

        var club = await _clubsRepository.GetByIdAsync(id, cancellationToken) ?? throw new BadRequestException("Club not found");

        club.Name = dto.Name;
        club.Address = dto.Address;
        club.City = dto.City;
        club.TotalCourts = dto.TotalCourts;
        club.WorkingHours = new List<WorkingHour>
    {
        CreateWorkingHour(DayOfWeek.Monday, dto.WorkingHours.Monday),
        CreateWorkingHour(DayOfWeek.Tuesday, dto.WorkingHours.Tuesday),
        CreateWorkingHour(DayOfWeek.Wednesday, dto.WorkingHours.Wednesday),
        CreateWorkingHour(DayOfWeek.Thursday, dto.WorkingHours.Thursday),
        CreateWorkingHour(DayOfWeek.Friday, dto.WorkingHours.Friday),
        CreateWorkingHour(DayOfWeek.Saturday, dto.WorkingHours.Saturday),
        CreateWorkingHour(DayOfWeek.Sunday, dto.WorkingHours.Sunday),
    }.Where(x => x != null).ToList();

        club = await _clubsRepository.UpdateAsync(club, cancellationToken);
        return MapToClub(club); // Переробити на автомапер (!!!)
    }


    private ClubResultDto MapToClub(Club club) => new ClubResultDto
    {
        Id = club.Id,
        Address = club.Address,
        City = club.City,
        TotalCourts = club.TotalCourts,
        WorkingHours = MapToWorkingHours(club.WorkingHours),
        Name = club.Name,

    };

    private WorkingHourDto MapToWorkingHours(List<WorkingHour> workingHours) => new WorkingHourDto
    {
        Monday = workingHours.Any(x => x.DayOfWeek == DayOfWeek.Monday) ? new TimeRangeDto
        {
            From = workingHours.FirstOrDefault(x => x.DayOfWeek == DayOfWeek.Monday).StartTime.ToString("hh\\:mm"),
            To = workingHours.FirstOrDefault(x => x.DayOfWeek == DayOfWeek.Monday).EndTime.ToString("hh\\:mm")
        } : null,

        Tuesday = workingHours.Any(x => x.DayOfWeek == DayOfWeek.Tuesday)
    ? new TimeRangeDto
    {
        From = workingHours.First(x => x.DayOfWeek == DayOfWeek.Tuesday).StartTime.ToString("hh\\:mm"),
        To = workingHours.First(x => x.DayOfWeek == DayOfWeek.Tuesday).EndTime.ToString("hh\\:mm")
    }
    : null,

        Wednesday = workingHours.Any(x => x.DayOfWeek == DayOfWeek.Wednesday)
    ? new TimeRangeDto
    {
        From = workingHours.First(x => x.DayOfWeek == DayOfWeek.Wednesday).StartTime.ToString("hh\\:mm"),
        To = workingHours.First(x => x.DayOfWeek == DayOfWeek.Wednesday).EndTime.ToString("hh\\:mm")
    }
    : null,

        Thursday = workingHours.Any(x => x.DayOfWeek == DayOfWeek.Thursday)
    ? new TimeRangeDto
    {
        From = workingHours.First(x => x.DayOfWeek == DayOfWeek.Thursday).StartTime.ToString("hh\\:mm"),
        To = workingHours.First(x => x.DayOfWeek == DayOfWeek.Thursday).EndTime.ToString("hh\\:mm")
    }
    : null,

        Friday = workingHours.Any(x => x.DayOfWeek == DayOfWeek.Friday)
    ? new TimeRangeDto
    {
        From = workingHours.First(x => x.DayOfWeek == DayOfWeek.Friday).StartTime.ToString("hh\\:mm"),
        To = workingHours.First(x => x.DayOfWeek == DayOfWeek.Friday).EndTime.ToString("hh\\:mm")
    }
    : null,

        Saturday = workingHours.Any(x => x.DayOfWeek == DayOfWeek.Saturday)
    ? new TimeRangeDto
    {
        From = workingHours.First(x => x.DayOfWeek == DayOfWeek.Saturday).StartTime.ToString("hh\\:mm"),
        To = workingHours.First(x => x.DayOfWeek == DayOfWeek.Saturday).EndTime.ToString("hh\\:mm")
    }
    : null,

        Sunday = workingHours.Any(x => x.DayOfWeek == DayOfWeek.Sunday)
    ? new TimeRangeDto
    {
        From = workingHours.First(x => x.DayOfWeek == DayOfWeek.Sunday).StartTime.ToString("hh\\:mm"),
        To = workingHours.First(x => x.DayOfWeek == DayOfWeek.Sunday).EndTime.ToString("hh\\:mm")
    }
    : null,
    };

    private WorkingHour CreateWorkingHour(DayOfWeek day, TimeRangeDto time)
    {
        if (time == null) return null;

        return new WorkingHour
        {
            DayOfWeek = day,
            StartTime = TimeOnly.Parse(time.From),
            EndTime = TimeOnly.Parse(time.To)
        };
    }


}
