using BadmintonApp.Application.DTOs.Clubs;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Clubs
{
    public interface IClubsService
    {
        Task<List<ClubResultDto>> GetAllAsync(string filter = null, CancellationToken cancellationToken = default);
        Task<ClubResultDto> CreateAsync(CreateClubDto dto, CancellationToken cancellationToken);
        Task<ClubResultDto> UpdateAsync(Guid id, UpdateClubDto dto, CancellationToken cancellationToken);
        Task DeleteAsync(Guid id, CancellationToken cancellationToken);
        Task AssignAdminAsync(Guid clubId, Guid userId, CancellationToken cancellationToken);
    }
}
