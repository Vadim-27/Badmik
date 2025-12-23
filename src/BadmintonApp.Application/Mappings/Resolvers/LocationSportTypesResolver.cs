using AutoMapper;
using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Domain.Clubs;
using System.Collections.Generic;
using System.Linq;

namespace BadmintonApp.Application.Mappings.Resolvers;
public class LocationSportTypesResolver
    : IValueResolver<Location, LocationResultDto, List<LocationSportDto>>
{
    public List<LocationSportDto> Resolve(
        Location source,
        LocationResultDto destination,
        List<LocationSportDto> destMember,
        ResolutionContext context)
    {
        if (source.Courts == null || source.Courts.Count == 0)
            return new List<LocationSportDto>();

        return source.Courts
            .GroupBy(c => c.Sport)
            .Select(g => new LocationSportDto
            {
                SportType = g.Key,
                CourtCount = g.Count()
            })
            .ToList();
    }
}