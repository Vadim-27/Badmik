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
    public interface ILocationsRepository
    {
        Task<Location?> GetByIdAsync(Guid id, CancellationToken cancellationToken);
        Task<List<Location>> GetByClubAsync(Guid clubId, CancellationToken cancellationToken);
        Task AddAsync(Location location, CancellationToken cancellationToken);
        Task UpdateAsync(Location location, CancellationToken cancellationToken);
        Task DeleteAsync(Location location, CancellationToken cancellationToken);
    }
}
