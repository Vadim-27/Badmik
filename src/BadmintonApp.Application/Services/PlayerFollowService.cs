using AutoMapper;
using BadmintonApp.Application.DTOs.Player;
using BadmintonApp.Application.Exceptions;
using BadmintonApp.Application.Interfaces.Players;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Players;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services
{
    public class PlayerFollowService : IPlayerFollowService
    {
        private readonly IPlayerRepository _playerRepository;
        private readonly IMapper _mapper;

        public PlayerFollowService(IPlayerRepository playerRepository, IMapper mapper)
        {
            _playerRepository = playerRepository;
            _mapper = mapper;
        }

        public Task<bool> SubscriptionExists(Guid followerPlayerId, Guid followingPlayerId, CancellationToken ct)
        {
            ValidatePair(followerPlayerId, followingPlayerId, allowSelf: true);
            return _playerRepository.SubscriptionExists(followerPlayerId, followingPlayerId, ct);
        }

        public async Task AddSubscription(Guid followerPlayerId, Guid followingPlayerId, CancellationToken ct)
        {
            ValidatePair(followerPlayerId, followingPlayerId, allowSelf: false);

            // Idempotent add (safe to call multiple times)
            var exists = await _playerRepository.SubscriptionExists(followerPlayerId, followingPlayerId, ct);
            if (exists) return;

            await _playerRepository.AddSubscription(followerPlayerId, followingPlayerId, ct);
        }

        public Task RemoveSubscription(Guid followerPlayerId, Guid followingPlayerId, CancellationToken ct)
        {
            ValidatePair(followerPlayerId, followingPlayerId, allowSelf: true);

            // Idempotent remove (repo should no-op if not found)
            return _playerRepository.RemoveSubscription(followerPlayerId, followingPlayerId, ct);
        }

        public Task<List<Guid>> GetFollowerIds(Guid playerId, CancellationToken ct)
        {
            if (playerId == Guid.Empty) throw new ArgumentException("playerId is empty.", nameof(playerId));
            return _playerRepository.GetFollowerIds(playerId, ct);
        }

        public Task<List<Guid>> GetFollowingIds(Guid playerId, CancellationToken ct)
        {
            if (playerId == Guid.Empty) throw new ArgumentException("playerId is empty.", nameof(playerId));
            return _playerRepository.GetFollowingIds(playerId, ct);
        }

        public async Task<List<PlayerFollowItemDto>> GetFollowers(Guid playerId, CancellationToken ct)
        {
            if (playerId == Guid.Empty) throw new ArgumentException("playerId is empty.", nameof(playerId));

            // Ordering should be decided in repository (e.g. CreatedAt desc)
            var ids = await _playerRepository.GetFollowerIds(playerId, ct);
            return await LoadAndMapPlayersPreservingOrder(ids, ct);
        }

        public async Task<List<PlayerFollowItemDto>> GetFollowings(Guid playerId, CancellationToken ct)
        {
            if (playerId == Guid.Empty) throw new ArgumentException("playerId is empty.", nameof(playerId));

            var ids = await _playerRepository.GetFollowingIds(playerId, ct);
            return await LoadAndMapPlayersPreservingOrder(ids, ct);
        }

        #region "helpers"

        private static void ValidatePair(Guid followerPlayerId, Guid followingPlayerId, bool allowSelf)
        {
            if (followerPlayerId == Guid.Empty)
                throw new ArgumentException("followerPlayerId is empty.", nameof(followerPlayerId));

            if (followingPlayerId == Guid.Empty)
                throw new ArgumentException("followingPlayerId is empty.", nameof(followingPlayerId));

            if (!allowSelf && followerPlayerId == followingPlayerId)
                throw new InvalidOperationException("Player cannot follow themself.");
        }

        private async Task<List<PlayerFollowItemDto>> LoadAndMapPlayersPreservingOrder(List<Guid> ids, CancellationToken ct)
        {
            if (ids == null || ids.Count == 0)
                return new List<PlayerFollowItemDto>();

            // One DB roundtrip for all players
            var uniqueIds = ids.Distinct().ToList();
            var players = await _playerRepository.GetByIdsAsync(uniqueIds, ct);

            // Preserve original order from ids
            var map = players.ToDictionary(p => p.Id);

            var result = new List<PlayerFollowItemDto>(ids.Count);
            foreach (var id in ids)
            {
                if (!map.TryGetValue(id, out var player)) continue;
                result.Add(_mapper.Map<PlayerFollowItemDto>(player));
            }

            return result;
        }
        #endregion
    }
}
