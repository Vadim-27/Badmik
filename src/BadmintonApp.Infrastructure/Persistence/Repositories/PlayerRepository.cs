using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.Trainings.Enums;
using Microsoft.EntityFrameworkCore;
using System;
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
            .AsNoTracking()
            .FirstAsync(x => x.Id == id);
    }

    public async Task Registration(Guid userId, PlayerLevel playerLevel, CancellationToken cancellationToken)
    {
        Player player = new Player
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Level = playerLevel
        };

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
}
