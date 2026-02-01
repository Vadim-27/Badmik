using BadmintonApp.Application.DTOs.Player;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Players
{
    public interface IPlayerFollowService
    {
        Task<bool> SubscriptionExists(Guid followerPlayerId, Guid followingPlayerId, CancellationToken ct);
        Task AddSubscription(Guid followerPlayerId, Guid followingPlayerId, CancellationToken ct);
        Task RemoveSubscription(Guid followerPlayerId, Guid followingPlayerId, CancellationToken ct);
        Task<List<Guid>> GetFollowerIds(Guid playerId, CancellationToken ct);
        Task<List<Guid>> GetFollowingIds(Guid playerId, CancellationToken ct);
        Task<List<PlayerFollowItemDto>> GetFollowers(Guid playerId, CancellationToken ct);
        Task<List<PlayerFollowItemDto>> GetFollowings(Guid playerId, CancellationToken ct);
    }
}
