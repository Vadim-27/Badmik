using AutoMapper;
using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Domain.Clubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Mappings
{
    public sealed class ClubProfile : Profile
    {
        public ClubProfile()
        {
            // CreateClubDto -> Club
            CreateMap<CreateClubDto, Club>()
                .ForMember(d => d.Id, opt => opt.Ignore())
                .ForMember(d => d.CreatedAt, opt => opt.Ignore())
                .ForMember(d => d.UpdatedAt, opt => opt.Ignore())
                .ForMember(d => d.IsActive, opt => opt.MapFrom(_ => true))
                .ForMember(d => d.Locations, opt => opt.Ignore());

            // DTO → Entity (UPDATE)
            CreateMap<UpdateClubDto, Club>()
                .ForMember(x => x.Id, opt => opt.Ignore())
                .ForMember(x => x.CreatedAt, opt => opt.Ignore())
                .ForMember(x => x.UpdatedAt, opt => opt.Ignore())
                .ForMember(x => x.IsActive, opt => opt.Ignore())
                .ForMember(x => x.Locations, opt => opt.Ignore());

            // Club -> ClubResultDto
            CreateMap<Club, ClubResultDto>()
                .ForMember(d => d.LocationCount,
                    opt => opt.MapFrom(s => s.Locations.Count));
        }
    }
}
