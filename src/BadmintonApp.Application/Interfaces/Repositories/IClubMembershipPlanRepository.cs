using BadmintonApp.Domain.Clubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories
{
    public interface IClubMembershipPlanRepository
    {
        Task<ClubMembershipPlan> GetById(Guid id, CancellationToken ct);
        Task<List<ClubMembershipPlan>> GetByClubId(Guid clubId, CancellationToken ct);

        Task Create(ClubMembershipPlan plan, CancellationToken ct);
        Task Update(ClubMembershipPlan plan, CancellationToken ct);
        Task Delete(ClubMembershipPlan plan, CancellationToken ct);

        Task<bool> NameExists(Guid clubId, string name, Guid? excludePlanId, CancellationToken ct);
    }
}
