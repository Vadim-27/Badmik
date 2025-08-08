using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.Interfaces.Clubs;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Clubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services;

public class ClubsService : IClubsService
{
    private readonly IClubsRepository _clubsRepository;
    private readonly IUserRepository _userRepository;

    public ClubsService(IClubsRepository clubsRepository, IUserRepository userRepository)
    {
        _clubsRepository = clubsRepository;
        _userRepository = userRepository;
    }
    public async Task<ResultDto> AssignAdminAsync(Guid clubId, Guid userId, CancellationToken cancellationToken)
    {
        var club = await _clubsRepository.GetByIdAsync(clubId, cancellationToken);
        if (club == null)
            return new ResultDto()
            {
                IsSuccess = false,
                Message = "Club not found"
            };

        //todo check user
        var user = await _userRepository
            .GetByIdAsync(userId, cancellationToken);
        if (user == null)
            return new ResultDto()
            {
                IsSuccess = false,
                Message = "User not found"
            };


        await _clubsRepository.AssignAdminAsync(clubId, userId, cancellationToken);
        return new ResultDto()
        {
            IsSuccess = true
        };

    }

    public async Task<ClubResultDto> CreateAsync(CreateClubDto dto, CancellationToken cancellationToken)
    {
        var club = new Club
        {
            Id = Guid.NewGuid(), //?
            Address = dto.Location.Address,
            City = dto.Location.City,
            Name = dto.Name,
            TotalCourts = dto.CourtCount,
            WorkingHours = new List<WorkingHour>()
            {
                CreateWorkingHour(DayOfWeek.Monday, dto.WorkingHours.Monday),
                CreateWorkingHour(DayOfWeek.Tuesday, dto.WorkingHours.Tuesday),
                CreateWorkingHour(DayOfWeek.Wednesday, dto.WorkingHours.Wednesday),
                CreateWorkingHour(DayOfWeek.Thursday, dto.WorkingHours.Thursday),
                CreateWorkingHour(DayOfWeek.Friday, dto.WorkingHours.Friday),
                CreateWorkingHour(DayOfWeek.Saturday, dto.WorkingHours.Saturday),
                CreateWorkingHour(DayOfWeek.Sunday, dto.WorkingHours.Sunday),
            }.Where(x => x != null).ToList()
        };

        var clubRes = await _clubsRepository.CreateAsync(club, cancellationToken);
        return ResultDto.Success<ClubResultDto>(MapToClub(clubRes));
    }

    public async Task<ResultDto> DeleteAsync(Guid id,  CancellationToken cancellationToken)
    {
        var club = await _clubsRepository.GetByIdAsync(id, cancellationToken);
        if (club is null)
            return new ResultDto
            {
                IsSuccess = false,
                Message = "Club not found"
            };

        return await _clubsRepository.DeleteAsync(id, cancellationToken)
            ? new ResultDto { IsSuccess = true }
            : new ResultDto { IsSuccess = false };
    }

    public async Task<List<ClubResultDto>> GetAllAsync(string filter = null, CancellationToken cancellationToken = default)
    {

        var clubs = await _clubsRepository.GetAllAsync(cancellationToken : cancellationToken);
        return clubs.Select(MapToClub).ToList();
    }

    public async Task<ClubResultDto> UpdateAsync(Guid id, UpdateClubDto dto, CancellationToken cancellationToken)
    {
        var club = await _clubsRepository.GetByIdAsync(id, cancellationToken);
        if (club == null)
            return new ClubResultDto
            {
                IsSuccess = false,
                Message = "Club not found"
            };

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
        return MapToClub(club);
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

    private WorkingHour? CreateWorkingHour(DayOfWeek day, TimeRangeDto time)
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
