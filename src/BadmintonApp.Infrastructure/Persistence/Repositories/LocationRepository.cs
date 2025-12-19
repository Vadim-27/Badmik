using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Clubs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Repositories
{
    public class LocationRepository : ILocationRepository
    {
        private readonly ApplicationDbContext _context;

        public LocationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Location?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
        {
            return await _context.Locations
                .Include(l => l.Courts)
                .Include(l => l.Amenities)
                .Include(l => l.Images)
                .Include(l => l.WorkingHours)
                .AsNoTracking()
                .FirstOrDefaultAsync(l => l.Id == id, cancellationToken);
        }

        public async Task<List<Location>> GetByClubIdAsync(Guid clubId, CancellationToken cancellationToken)
        {
            return await _context.Locations
                .Include(l => l.Courts)
                .Include(l => l.Amenities)
                .Include(l => l.Images)
                .Include(l => l.WorkingHours)
                .Where(l => l.ClubId == clubId)
                .OrderBy(l => l.Order)
                .ThenBy(l => l.Name)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<Location> CreateAsync(Location location, CancellationToken cancellationToken)
        {
            if (location == null)
                throw new ArgumentNullException(nameof(location));

            _context.Locations.Add(location);
            await _context.SaveChangesAsync(cancellationToken);

            return location;
        }

        public async Task<Location> UpdateAsync(Location location, CancellationToken cancellationToken)
        {
            if (location == null)
                throw new ArgumentNullException(nameof(location));

            _context.Locations.Update(location);
            await _context.SaveChangesAsync(cancellationToken);

            return location;
        }

       public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
        {
            var entity = await _context.Locations
                .FirstOrDefaultAsync(l => l.Id == id, cancellationToken);

            if (entity == null)
                return false;

            _context.Locations.Remove(entity);
            await _context.SaveChangesAsync(cancellationToken);

            return true;
        }

        public async Task<bool> ExistsAsync(
            Guid id,
            CancellationToken cancellationToken)
        {
            return await _context.Locations
                .AnyAsync(l => l.Id == id, cancellationToken);
        }

    }
}
