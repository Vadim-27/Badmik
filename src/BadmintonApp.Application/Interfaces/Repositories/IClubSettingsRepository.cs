using BadmintonApp.Domain.Clubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories
{
    public interface IClubSettingsRepository
    {
        Task<ClubSettings> GetOrCreateAsync(Guid clubId, CancellationToken ct);
        Task UpdateAsync(ClubSettings settings, CancellationToken ct);
    }
}
