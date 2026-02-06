using BadmintonApp.Application.DTOs.Clubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Clubs
{
    public interface IClubSettingsService
    {
        Task<ClubSettingsDto> GetAsync(Guid clubId, CancellationToken ct);
        Task<ClubSettingsDto> UpdateAsync(Guid clubId, ClubSettingsDto dto, CancellationToken ct);
    }
}
