using AutoMapper;
using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Domain.Clubs;

namespace BadmintonApp.Application.Mappings;

public class WorkingHourMappingProfile : Profile
{
    public WorkingHourMappingProfile()
    {
        CreateMap<WorkingHourDto, WorkingHour>();
        CreateMap<WorkingHour, WorkingHourDto>();
    }
}
