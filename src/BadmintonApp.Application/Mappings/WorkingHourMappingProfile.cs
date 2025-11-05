using AutoMapper;
using BadmintonApp.Application.DTOs.WorkingHourDtos;
using BadmintonApp.Domain.WorkingHours;

namespace BadmintonApp.Application.Mappings;

public class WorkingHourMappingProfile : Profile
{
    public WorkingHourMappingProfile()
    {
        CreateMap<WorkingHourDto, WorkingHour>();
        CreateMap<WorkingHour, WorkingHourDto>();
    }
}
