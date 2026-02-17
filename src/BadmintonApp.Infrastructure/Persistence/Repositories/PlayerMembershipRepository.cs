using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Player;
using BadmintonApp.Domain.Enums.Training;
using BadmintonApp.Domain.Players;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Repositories
{
    public class PlayerMembershipRepository : IPlayerMembershipRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public PlayerMembershipRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<PlayerClubMembership>> GetByPlayerIdAsync(Guid playerId, Guid? clubId, CancellationToken ct)
        {
            var query = _dbContext.PlayerClubMemberships
                .AsNoTracking()
                .Where(x => x.PlayerId == playerId)
                .AsQueryable();

            if (clubId.HasValue)
                query = query.Where(x => x.ClubId == clubId.Value);

            return await query
                .OrderByDescending(x => x.ValidFrom)
                .ToListAsync(ct);
        }

        public Task<PlayerClubMembership?> GetByIdAsync(Guid membershipId, CancellationToken ct)
        {
            return _dbContext.PlayerClubMemberships
                .FirstOrDefaultAsync(x => x.Id == membershipId, ct);
        }

        public async Task CreateAsync(PlayerClubMembership membership, CancellationToken ct)
        {
            await _dbContext.PlayerClubMemberships.AddAsync(membership, ct);
            await _dbContext.SaveChangesAsync(ct);
        }

        public async Task UpdateAsync(PlayerClubMembership membership, CancellationToken ct)
        {
            _dbContext.PlayerClubMemberships.Update(membership);
            await _dbContext.SaveChangesAsync(ct);
        }

        public async Task DeleteAsync(PlayerClubMembership membership, CancellationToken ct)
        {
            _dbContext.PlayerClubMemberships.Remove(membership);
            await _dbContext.SaveChangesAsync(ct);
        }

        public async Task<bool> HasOverlapAsync(Guid playerId, Guid clubId, DateTime validFrom, DateTime validUntil, Guid? excludeMembershipId, CancellationToken ct)
        {
            var q = _dbContext.PlayerClubMemberships
                .AsQueryable()
                .Where(x =>
                    x.PlayerId == playerId &&
                    x.ClubId == clubId &&
                    x.Status == MembershipStatus.Active);

            if (excludeMembershipId.HasValue)
                q = q.Where(x => x.Id != excludeMembershipId.Value);

            return await q.AnyAsync(x =>
                x.ValidFrom < validUntil &&
                (x.ValidUntil ?? DateTime.MaxValue) > validFrom,
                ct);
        }

        public async Task<PlayerClubMembership?> GetLatestAsync(Guid playerId, Guid clubId, CancellationToken ct)
        {
            return await _dbContext.PlayerClubMemberships
                .AsNoTracking()
                .Where(x => x.PlayerId == playerId && x.ClubId == clubId)
                .OrderByDescending(x => x.ValidUntil ?? DateTime.MaxValue)
                .FirstOrDefaultAsync(ct);
        }

        Task<PlayerClubMembership> IPlayerMembershipRepository.FindCoveringMembershipForUpdateAsync(Guid playerId, Guid clubId, SportType sport, TrainingType trainingType, DateTime dayUtcDate, CancellationToken ct)
        {
            throw new NotImplementedException();
        }
    }
}
