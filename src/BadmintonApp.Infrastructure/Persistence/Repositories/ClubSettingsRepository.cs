using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Clubs;
using Microsoft.EntityFrameworkCore;
using System.Threading;

namespace BadmintonApp.Infrastructure.Persistence.Repositories
{
    public sealed class ClubSettingsRepository : IClubSettingsRepository
    {
        private readonly ApplicationDbContext _context;

        public ClubSettingsRepository(ApplicationDbContext context) => _context = context;

        public async Task<ClubSettings> GetOrCreateAsync(Guid clubId, CancellationToken ct)
        {
            var settings = await _context.ClubSettings
                .FirstOrDefaultAsync(x => x.ClubId == clubId, ct);

            if (settings != null)
                return settings;

            settings = new ClubSettings
            {
                ClubId = clubId,
                UpdatedAt = DateTime.UtcNow
            };

            _context.ClubSettings.Add(settings);
            await _context.SaveChangesAsync(ct);

            return settings;
        }

        public async Task UpdateAsync(ClubSettings settings, CancellationToken ct)
        {
            _context.ClubSettings.Update(settings);
            await _context.SaveChangesAsync(ct);
        }
    }
}
