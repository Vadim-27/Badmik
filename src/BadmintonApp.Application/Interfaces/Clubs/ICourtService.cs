using BadmintonApp.Application.DTOs.Clubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Clubs
{
    public interface ICourtsService
    {
        Task SyncForLocationAsync(
            Guid locationId,
            List<LocationSportDto> sportsConfig,
            CancellationToken cancellationToken = default);
    }
}
