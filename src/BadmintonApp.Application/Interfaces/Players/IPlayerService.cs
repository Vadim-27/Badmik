using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Paginations;
using BadmintonApp.Application.DTOs.Player;
using BadmintonApp.Application.DTOs.Staff;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Players;

public interface IPlayerService
{
    Task Create(CreatePlayerDto dto, CancellationToken cancellationToken);
    Task Update(UpdatePlayerDto dto, CancellationToken cancellationToken);
    Task<PlayerDto> GetById(Guid Id, CancellationToken cancellationToken);
    Task<PlayerDto> GetByUserId(Guid Id, CancellationToken cancellationToken);
    Task<PaginationListDto<PlayerDto>> GetAll(ClubPaginationFilterDto paginationFilterDto, CancellationToken cancellationToken);
    Task ChangePassword(PlayerUpdatePasswordDto staffUpdateDto, CancellationToken cancellationToken);
    Task UpdateSportProfilesAsync(Guid Id, UpdatePlayerSportProfilesDto dto, CancellationToken ct);
    Task<List<PlayerDto>> GetByIdsAsync(List<Guid> ids, CancellationToken ct);
}
