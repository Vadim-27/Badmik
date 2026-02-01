using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Paginations;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Enums.Player;
using BadmintonApp.Domain.Players;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Repositories;

public class PlayerRepository : IPlayerRepository
{
    private readonly ApplicationDbContext _dbContext;

    public PlayerRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Player> GetById(Guid id, CancellationToken cancellationToken)
    {
        return await _dbContext.Players
            .Include(x => x.User)
            .Include(x => x.SportProfiles)
            .AsNoTracking()
            .FirstAsync(x => x.Id == id);
    }

    public async Task<Player> GetByUserId(Guid id, CancellationToken cancellationToken)
    {
        return await _dbContext.Players
            .AsNoTracking()
            .Include(x => x.User)
            .FirstAsync(x => x.UserId == id);
    }

    public async Task Create(Player player, CancellationToken cancellationToken)
    {
        await _dbContext.AddAsync(player, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task Update(Player player, CancellationToken cancellationToken)
    {
        var currentPlayer = await _dbContext.Players
            .AsNoTracking()
            .FirstAsync(x => x.Id == player.Id, cancellationToken);

        player.UserId = currentPlayer.UserId;

        _dbContext.Players.Update(player);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task<List<PlayerSportProfile>> GetSportProfilesAsync(Guid playerId, CancellationToken ct = default) =>
        _dbContext.PlayerSportProfiles.Where(x => x.PlayerId == playerId).ToListAsync(ct);

    public async Task UpdateSportProfilesAsync(
        Guid playerId,
        IReadOnlyCollection<PlayerSportProfile> sportProfiles,
        CancellationToken ct = default)
    {
        var existing = await _dbContext.PlayerSportProfiles
            .Where(x => x.PlayerId == playerId)
            .ToListAsync(ct);

        // replace-all: what came in is the final set
        var incomingBySport = sportProfiles.ToDictionary(x => x.Sport, x => x.Level);

        // remove missing
        var toRemove = existing.Where(x => !incomingBySport.ContainsKey(x.Sport)).ToList();
        if (toRemove.Count > 0)
            _dbContext.PlayerSportProfiles.RemoveRange(toRemove);

        // update existing
        foreach (var e in existing)
        {
            if (incomingBySport.TryGetValue(e.Sport, out var lvl))
                e.Level = lvl;
        }

        // add new
        var existingSports = existing.Select(x => x.Sport).ToHashSet();
        var toAdd = sportProfiles.Where(x => !existingSports.Contains(x.Sport)).ToList();
        if (toAdd.Count > 0)
            await _dbContext.PlayerSportProfiles.AddRangeAsync(toAdd, ct);
    }

    public async Task<bool> SubscriptionExists(Guid followerPlayerId, Guid followingPlayerId, CancellationToken ct)
    {
        return await _dbContext.PlayerSubscriptions
            .AsNoTracking()
            .AnyAsync(x => x.FollowerPlayerId == followerPlayerId && x.FollowingPlayerId == followingPlayerId, ct);
    }

    public async Task AddSubscription(Guid followerPlayerId, Guid followingPlayerId, CancellationToken ct)
    {
        // idempotent
        var exists = await _dbContext.PlayerSubscriptions
            .AnyAsync(x => x.FollowerPlayerId == followerPlayerId && x.FollowingPlayerId == followingPlayerId, ct);

        if (exists) return;

        await _dbContext.PlayerSubscriptions.AddAsync(new PlayerSubscription
        {
            FollowerPlayerId = followerPlayerId,
            FollowingPlayerId = followingPlayerId,
            CreatedAt = DateTime.UtcNow
        }, ct);

        await _dbContext.SaveChangesAsync(ct);
    }

    public async Task RemoveSubscription(Guid followerPlayerId, Guid followingPlayerId, CancellationToken ct)
    {
        var entity = await _dbContext.PlayerSubscriptions
            .FirstOrDefaultAsync(x => x.FollowerPlayerId == followerPlayerId && x.FollowingPlayerId == followingPlayerId, ct);

        if (entity is null) return; // idempotent

        _dbContext.PlayerSubscriptions.Remove(entity);
        await _dbContext.SaveChangesAsync(ct);
    }

    public async Task<List<Guid>> GetFollowerIds(Guid playerId, CancellationToken ct)
    {
        return await _dbContext.PlayerSubscriptions
            .AsNoTracking()
            .Where(x => x.FollowingPlayerId == playerId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => x.FollowerPlayerId)
            .ToListAsync(ct);
    }

    public async Task<List<Guid>> GetFollowingIds(Guid playerId, CancellationToken ct)
    {
        return await _dbContext.PlayerSubscriptions
            .AsNoTracking()
            .Where(x => x.FollowerPlayerId == playerId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => x.FollowingPlayerId)
            .ToListAsync(ct);
    }


    public async Task<PaginationListDto<Player>> GetAll(ClubPaginationFilterDto paginationFilterDto, CancellationToken cancellationToken)
    {
        var query = _dbContext.Players
            .AsNoTracking()
            .Include(x => x.User)
            .Include(p => p.SportProfiles)
            .OrderBy(x => x.User.LastName)
            .AsQueryable();

        if (paginationFilterDto.ClubId.HasValue)
        {
            query = query.Where(x => x.ClubId == paginationFilterDto.ClubId.Value);
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Skip((paginationFilterDto.Page - 1) * paginationFilterDto.PageSize)
            .Take(paginationFilterDto.PageSize)
            .ToListAsync(cancellationToken);

        return new PaginationListDto<Player>
        {
            List = items,
            TotalCount = totalCount,
            Page = paginationFilterDto.Page,
            PageSize = paginationFilterDto.PageSize
        };
    }

    public async Task<List<Player>> GetByIdsAsync(List<Guid> ids, CancellationToken ct)
    {
        if (ids == null || ids.Count == 0)
            return new List<Player>();

        return await _dbContext.Players
            .Where(p => ids.Contains(p.Id))
            .Include(p => p.User)
            .Include(p => p.SportProfiles)
            .AsNoTracking()
            .ToListAsync(ct);
    }
}
