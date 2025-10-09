using AutoMapper;
using BadmintonApp.Application.DTOs.Staff;
using BadmintonApp.Domain.Core;

namespace BadmintonApp.Application.Mappings;

public class StaffMappingProfile : Profile
{
    public StaffMappingProfile()
    {
        CreateMap<StaffUpdateDto, Staff>();

        CreateMap<Staff, StaffDto>()
            .ForMember(dest => dest.FirstName, s => s.MapFrom(x => x.User.FirstName))
            .ForMember(dest => dest.LastName, s => s.MapFrom(x => x.User.LastName))
            .ForMember(dest => dest.Email, s => s.MapFrom(x => x.User.Email));

        CreateMap<StaffDto, Staff>();
        CreateMap<StaffRegisterDto, Staff>();

    }
}
