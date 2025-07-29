using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Application.DTOs.Common;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces
{
    public interface IClubsService
    {
        Task<List<ClubResultDto>> GetAllAsync(string? filter = null, CancellationToken cancellationToken = default);
        Task<ClubResultDto> CreateAsync(CreateClubDto dto);
        Task<ClubResultDto> UpdateAsync(Guid id, UpdateClubDto dto);
        Task<ResultDto> DeleteAsync(Guid id);
        Task<ResultDto> AssignAdminAsync(Guid clubId, Guid userId);
    }
}
