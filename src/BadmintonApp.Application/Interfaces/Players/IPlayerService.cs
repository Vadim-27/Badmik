using BadmintonApp.Application.DTOs.Player;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Players;

public interface IPlayerService
{
    Task Update(PlayerUpdateDto dto, CancellationToken cancellationToken);    
}
