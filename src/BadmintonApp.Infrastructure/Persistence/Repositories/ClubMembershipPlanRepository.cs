using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Clubs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Repositories
{
    public class ClubMembershipPlanRepository : IClubMembershipPlanRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public ClubMembershipPlanRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ClubMembershipPlan> GetById(Guid id, CancellationToken ct)
        {
            return await _dbContext.ClubMembershipPlans
                .AsNoTracking()
                .FirstAsync(x => x.Id == id, ct);
        }

        public async Task<ClubMembershipPlan> GetByIdTracked(Guid id, CancellationToken ct)
        {
            return await _dbContext.ClubMembershipPlans
                .FirstAsync(x => x.Id == id, ct);
        }

        public async Task<List<ClubMembershipPlan>> GetByClubId(Guid clubId, CancellationToken ct)
        {
            return await _dbContext.ClubMembershipPlans
                .AsNoTracking()
                .Where(x => x.ClubId == clubId)
                .OrderBy(x => x.Name)
                .ToListAsync(ct);
        }

        public async Task Create(ClubMembershipPlan plan, CancellationToken ct)
        {
            await _dbContext.AddAsync(plan, ct);
            await _dbContext.SaveChangesAsync(ct);
        }

        public async Task Update(ClubMembershipPlan plan, CancellationToken ct)
        {
            _dbContext.Update(plan);
            await _dbContext.SaveChangesAsync(ct);
        }

        public async Task Delete(ClubMembershipPlan plan, CancellationToken ct)
        {
            _dbContext.Remove(plan);
            await _dbContext.SaveChangesAsync(ct);
        }

        public Task<bool> NameExists(Guid clubId, string name, Guid? excludePlanId, CancellationToken ct)
        {
            var q = _dbContext.ClubMembershipPlans.AsQueryable()
                .Where(x => x.ClubId == clubId && x.Name == name);

            if (excludePlanId.HasValue)
                q = q.Where(x => x.Id != excludePlanId.Value);

            return q.AnyAsync(ct);
        }
    }
}
