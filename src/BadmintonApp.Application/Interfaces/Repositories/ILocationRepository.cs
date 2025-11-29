using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Domain.Clubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories
{
    public interface ILocationRepository
    {
        Task<Location> GetByIdAsync(Guid id, CancellationToken cancellationToken);
        Task<List<Location>> GetByClubIdAsync(Guid clubId, CancellationToken cancellationToken);
        Task<Location> CreateAsync(Location location, CancellationToken cancellationToken);
        Task<Location> UpdateAsync(Location location, CancellationToken cancellationToken);
        Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken);
    }
}
