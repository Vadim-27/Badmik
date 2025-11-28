using BadmintonApp.Domain.Clubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories
{
    public interface ICourtsRepository
    {
        Task<List<Court>> GetByLocationIdAsync(Guid locationId, CancellationToken cancellationToken);

        Task AddRangeAsync(IEnumerable<Court> courts, CancellationToken cancellationToken);
        Task UpdateRangeAsync(IEnumerable<Court> courts, CancellationToken cancellationToken);
    }
}
