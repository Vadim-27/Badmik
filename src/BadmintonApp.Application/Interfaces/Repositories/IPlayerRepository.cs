using BadmintonApp.Application.DTOs.Logs;
using BadmintonApp.Domain.Enums.Player;
using BadmintonApp.Domain.Logs;
using BadmintonApp.Domain.Players;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories;

public interface IPlayerRepository
{
    Task Registration(Guid userId, PlayerLevel playerLevel, CancellationToken cancellationToken);
    Task Update(Player player, CancellationToken cancellationToken);
    Task<Player> GetById(Guid id, CancellationToken cancellationToken);
    Task<Player> GetByUserId(Guid id, CancellationToken cancellationToken);
}
    
