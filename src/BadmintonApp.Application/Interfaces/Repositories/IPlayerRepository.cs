using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Logs;
using BadmintonApp.Application.DTOs.Paginations;
using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.Enums.Player;
using BadmintonApp.Domain.Logs;
using BadmintonApp.Domain.Players;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories;

public interface IPlayerRepository
{
    Task Create(Player player, CancellationToken cancellationToken);
    Task Update(Player player, CancellationToken cancellationToken);
    Task<Player> GetById(Guid id, CancellationToken cancellationToken);
    Task<Player> GetByUserId(Guid id, CancellationToken cancellationToken);
    Task<PaginationListDto<Player>> GetAll(ClubPaginationFilterDto paginationFilterDto, CancellationToken cancellationToken);
    Task<List<PlayerSportProfile>> GetSportProfilesAsync(Guid playerId, CancellationToken ct);
    Task UpdateSportProfilesAsync(Guid playerId, IReadOnlyCollection<PlayerSportProfile> sportProfiles, CancellationToken ct);
    Task<bool> SubscriptionExists(Guid followerPlayerId, Guid followingPlayerId, CancellationToken ct);
    Task AddSubscription(Guid followerPlayerId, Guid followingPlayerId, CancellationToken ct);
    Task RemoveSubscription(Guid followerPlayerId, Guid followingPlayerId, CancellationToken ct);
    Task<List<Guid>> GetFollowerIds(Guid playerId, CancellationToken ct);
    Task<List<Guid>> GetFollowingIds(Guid playerId, CancellationToken ct);
    Task<List<Player>> GetByIdsAsync(List<Guid> ids, CancellationToken ct);
}
    
