using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Training;
using BadmintonApp.Domain.Players;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories
{
    public interface IPlayerMembershipRepository
    {
        Task<List<PlayerClubMembership>> GetByPlayerIdAsync(Guid playerId, Guid? clubId, CancellationToken ct);
        Task<PlayerClubMembership?> GetByIdAsync(Guid membershipId, CancellationToken ct);

        Task CreateAsync(PlayerClubMembership membership, CancellationToken ct);
        Task UpdateAsync(PlayerClubMembership membership, CancellationToken ct);
        Task DeleteAsync(PlayerClubMembership membership, CancellationToken ct);
        Task<bool> HasOverlapAsync(Guid playerId, Guid clubId, DateTime validFrom, DateTime validUntil, Guid? excludeMembershipId, CancellationToken ct);
        Task<PlayerClubMembership?> GetLatestAsync(Guid playerId, Guid clubId, SportType sportType, TrainingType trainingType, CancellationToken ct);
        // Lock membership row for update when charging
        Task<PlayerClubMembership?> FindCoveringMembershipForUpdateAsync(Guid playerId, Guid clubId, SportType sport, TrainingType trainingType, DateTime dayUtcDate, CancellationToken ct);
    }
}
