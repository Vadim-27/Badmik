using AutoMapper;
using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Application.Mappings.Resolvers;
using BadmintonApp.Domain.Clubs;
using BadmintonApp.Domain.Enums.Club;
using BadmintonApp.Domain.WorkingHours;
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
            // PriceFrom -> PriceText
            .ForMember(d => d.PriceText,
                opt => opt.MapFrom(s => s.PriceFrom))

            // CourtCount from Courts collection (null-safe)
            .ForMember(d => d.CourtCount,
                opt => opt.MapFrom(s => s.Courts != null ? s.Courts.Count : 0))

            // Logo can be mapped by convention, but we leave it explicitly for clarity
            .ForMember(d => d.Logo,
                opt => opt.MapFrom(s => s.Logo))

            // Amenities: take enum values from LocationAmenity
            .ForMember(d => d.Amenities,
                opt => opt.MapFrom(s => s.Amenities != null
                    ? s.Amenities.Select(a => a.Amenity)
                    : Enumerable.Empty<AmenityType>()))

            // Images: map collection to LocationImageDto
            .ForMember(d => d.Images,
                opt => opt.MapFrom(s => s.Images ?? new List<LocationImage>()))

            // Working hours collection (requires WorkingHour -> WorkingHourDto mapping)
            .ForMember(d => d.WorkingHours, opt => opt.Ignore())

            // Sports/SportTypes are derived values – keep them for service to fill
            .ForMember(d => d.Sports, opt => opt.MapFrom<LocationSportTypesResolver>());


            
            // --------- CreateLocationDto → Location ---------
            CreateMap<CreateLocationDto, Location>()
                .ForMember(d => d.Id, opt => opt.Ignore())
                .ForMember(d => d.Courts, opt => opt.Ignore())
                .ForMember(d => d.WorkingHours, opt => opt.Ignore())
                .ForMember(dest => dest.WorkingHours, s => s.MapFrom(x => new List<WorkingHour>
                {
                    WHM.CreateWorkingHour(DayOfWeek.Monday, x.WorkingHours.Monday),
                    WHM.CreateWorkingHour(DayOfWeek.Tuesday, x.WorkingHours.Tuesday),
                    WHM.CreateWorkingHour(DayOfWeek.Wednesday, x.WorkingHours.Wednesday),
                    WHM.CreateWorkingHour(DayOfWeek.Thursday, x.WorkingHours.Thursday),
                    WHM.CreateWorkingHour(DayOfWeek.Friday, x.WorkingHours.Friday),
                    WHM.CreateWorkingHour(DayOfWeek.Saturday, x.WorkingHours.Saturday),
                    WHM.CreateWorkingHour(DayOfWeek.Sunday, x.WorkingHours.Sunday),
                }.Where(x => x != null).ToList()));
            ;

            CreateMap<UpdateLocationDto, Location>()
                .ForMember(d => d.Id, opt => opt.Ignore())
                .ForMember(d => d.ClubId, opt => opt.Ignore()) // should not be changed
                .ForMember(d => d.Courts, opt => opt.Ignore())
                .ForMember(dest => dest.WorkingHours, s => s.MapFrom(x => new List<WorkingHour>
                {
                    WHM.CreateWorkingHour(DayOfWeek.Monday, x.WorkingHours.Monday),
                    WHM.CreateWorkingHour(DayOfWeek.Tuesday, x.WorkingHours.Tuesday),
                    WHM.CreateWorkingHour(DayOfWeek.Wednesday, x.WorkingHours.Wednesday),
                    WHM.CreateWorkingHour(DayOfWeek.Thursday, x.WorkingHours.Thursday),
                    WHM.CreateWorkingHour(DayOfWeek.Friday, x.WorkingHours.Friday),
                    WHM.CreateWorkingHour(DayOfWeek.Saturday, x.WorkingHours.Saturday),
                    WHM.CreateWorkingHour(DayOfWeek.Sunday, x.WorkingHours.Sunday),
                }.Where(x => x != null).ToList()));
        }
    }
}
