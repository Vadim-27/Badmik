using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Application.DTOs.Common;
using Microsoft.Extensions.Primitives;
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
        Task<ResultDto> DeleteAsync(Guid id, CancellationToken cancellationToken);
        Task<ResultDto> AssignAdminAsync(Guid clubId, Guid userId, CancellationToken cancellationToken);
    }
}
