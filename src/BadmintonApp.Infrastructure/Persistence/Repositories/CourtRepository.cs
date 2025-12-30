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
    public class CourtsRepository : ICourtsRepository
    {
        private readonly ApplicationDbContext _context;

        public CourtsRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        
        public async Task<List<Court>> GetByLocationIdAsync(
            Guid locationId,
            CancellationToken cancellationToken)
        {
            return await _context.Courts
                .AsNoTracking()
                .Where(c => c.LocationId == locationId)
                .ToListAsync(cancellationToken);
        }

        
        public async Task AddRangeAsync(
            IEnumerable<Court> courts,
            CancellationToken cancellationToken)
        {
            if (courts == null)
                throw new ArgumentNullException(nameof(courts));

            _context.Courts.AddRange(courts);
            await _context.SaveChangesAsync(cancellationToken);
        }

        
        public async Task UpdateRangeAsync(
            IEnumerable<Court> courts,
            CancellationToken cancellationToken)
        {
            if (courts == null)
                throw new ArgumentNullException(nameof(courts));

            _context.Courts.UpdateRange(courts);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
