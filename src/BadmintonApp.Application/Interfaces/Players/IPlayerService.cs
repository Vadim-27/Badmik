using BadmintonApp.Application.DTOs.Player;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Players;

public interface IPlayerService
{
    Task Update(PlayerUpdateDto dto, CancellationToken cancellationToken);
    Task<PlayerDto> GetById(Guid Id, CancellationToken cancellationToken);


}
