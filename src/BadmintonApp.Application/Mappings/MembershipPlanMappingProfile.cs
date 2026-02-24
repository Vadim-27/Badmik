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
    public class MembershipPlanMappingProfile : Profile
    {
        public MembershipPlanMappingProfile()
        {
            CreateMap<ClubMembershipPlan, ClubMembershipPlanDto>();

            CreateMap<CreateClubMembershipPlanDto, ClubMembershipPlan>()
                .ForMember(d => d.Id, opt => opt.Ignore())
                .ForMember(d => d.CreatedAtUtc, opt => opt.Ignore())
                .ForMember(d => d.UpdatedAtUtc, opt => opt.Ignore());

            CreateMap<UpdateClubMembershipPlanDto, ClubMembershipPlan>()
                .ForMember(d => d.Id, opt => opt.Ignore())
                .ForMember(d => d.ClubId, opt => opt.Ignore())
                .ForMember(d => d.CreatedAtUtc, opt => opt.Ignore())
                .ForMember(d => d.UpdatedAtUtc, opt => opt.Ignore());
        }
    }
}
