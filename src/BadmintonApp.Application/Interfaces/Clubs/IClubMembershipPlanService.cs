using BadmintonApp.Application.DTOs.Clubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Clubs
{
    public interface IClubMembershipPlanService
    {
        Task<ClubMembershipPlanDto> GetById(Guid clubId, Guid planId, CancellationToken ct);
        Task<List<ClubMembershipPlanDto>> GetByClub(Guid clubId, CancellationToken ct);

        Task<ClubMembershipPlanDto> Create(Guid clubId, CreateClubMembershipPlanDto dto, CancellationToken ct);
        Task<ClubMembershipPlanDto> Update(Guid clubId, Guid planId, UpdateClubMembershipPlanDto dto, CancellationToken ct);
        Task Delete(Guid clubId, Guid planId, CancellationToken ct);
    }
}
