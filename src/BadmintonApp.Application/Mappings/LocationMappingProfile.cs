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
    public sealed class LocationMappingProfile : Profile
    {
        public LocationMappingProfile()
        {
            CreateMap<Location, LocationResultDto>()
                .ForMember(d => d.ClubId, opt => opt.MapFrom(s => s.ClubId))
                .ForMember(d => d.CourtCount, opt => opt.MapFrom(s => s.Courts.Count(c => c.IsActive)))
                .ForMember(d => d.SportTypes, opt => opt.MapFrom(s =>
                    s.Courts
                        .Where(c => c.IsActive)
                        .Select(c => c.Sport)
                        .Distinct()
                        .ToArray()))
                .ForMember(d => d.Sports, opt => opt.MapFrom(s =>
                    s.Courts
                        .Where(c => c.IsActive)
                        .GroupBy(c => c.Sport)
                        .Select(g => new LocationSportDto
                        {
                            SportType = g.Key,
                            CourtCount = g.Count()
                        })))
                
                .ForMember(d => d.WorkingHours, opt => opt.Ignore());

            CreateMap<Location, LocationResultDto>()
                .ForMember(d => d.CourtCount, opt => opt.MapFrom(s => s.Courts.Count(c => c.IsActive)))
                .ForMember(d => d.SportTypes, opt => opt.MapFrom(s =>
                    s.Courts
                        .Where(c => c.IsActive)
                        .Select(c => c.Sport)
                        .Distinct()
                        .ToArray()));
            // --------- CreateLocationDto → Location ---------
            CreateMap<CreateLocationDto, Location>()
                .ForMember(d => d.Id, opt => opt.Ignore())
                .ForMember(d => d.Courts, opt => opt.Ignore())
                .ForMember(d => d.WorkingHours, opt => opt.Ignore())
                ;

            CreateMap<UpdateLocationDto, Location>()
                .ForMember(d => d.Id, opt => opt.Ignore())
                .ForMember(d => d.ClubId, opt => opt.Ignore()) // should not be changed
                .ForMember(d => d.Courts, opt => opt.Ignore())
                .ForMember(d => d.WorkingHours, opt => opt.Ignore());
        }
    }
}
