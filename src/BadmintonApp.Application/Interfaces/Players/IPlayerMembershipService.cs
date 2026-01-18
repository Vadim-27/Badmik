using BadmintonApp.Application.DTOs.Player;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Players
{
    public interface IPlayerMembershipService
    {
        Task<List<MembershipDto>> GetAllAsync(Guid playerId, Guid? clubId, CancellationToken ct);
        Task<MembershipDto> GetByIdAsync(Guid playerId, Guid membershipId, CancellationToken ct);

        Task<Guid> CreateAsync(Guid playerId, CreateMembershipDto dto, CancellationToken ct);
        Task UpdateAsync(Guid playerId, Guid membershipId, UpdateMembershipDto dto, CancellationToken ct);
        Task DeleteAsync(Guid playerId, Guid membershipId, CancellationToken ct);
    }
}
