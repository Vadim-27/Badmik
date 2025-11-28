using BadmintonApp.Application.DTOs.Clubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Clubs
{
    public interface ILocationService
    {
        Task<List<LocationResultDto>> GetByClubIdAsync(Guid clubId, CancellationToken cancellationToken = default);
        Task<LocationResultDto> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
        Task<LocationResultDto> CreateAsync(CreateLocationDto dto, CancellationToken cancellationToken = default);
        Task<LocationResultDto> UpdateAsync(Guid id, UpdateLocationDto dto, CancellationToken cancellationToken = default);
        Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    }
}
