using AutoMapper;
using BadmintonApp.Application.DTOs.Logs;
using BadmintonApp.Domain.Logs;

namespace BadmintonApp.Application.Mappings;

public class LogMappingProfile : Profile
{
    public LogMappingProfile()
    {
        CreateMap<Log, LogDto>();
    }
}
