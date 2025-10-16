using BadmintonApp.Application.Interfaces.Players;
using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.Trainings.Enums;
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
}
