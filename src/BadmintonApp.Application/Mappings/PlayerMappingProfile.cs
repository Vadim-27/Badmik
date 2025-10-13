using AutoMapper;
using BadmintonApp.Application.DTOs.Player;
using BadmintonApp.Application.DTOs.Staff;
using BadmintonApp.Domain.Core;

namespace BadmintonApp.Application.Mappings;

public class PlayerMappingProfile : Profile
{
    public PlayerMappingProfile()
    {
        CreateMap<PlayerUpdateDto, Player>();

    }
}
