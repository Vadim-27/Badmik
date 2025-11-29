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
    public sealed class LocationImageProfile : Profile
    {
        public LocationImageProfile()
        {
            CreateMap<LocationImage, LocationImageDto>();
        }
    }
}
