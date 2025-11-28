using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Clubs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Repositories;

public class ClubRepository : IClubsRepository
{
    private readonly ApplicationDbContext _context;

    public ClubRepository(ApplicationDbContext context)
    {
        _context = context;
    }    

    public async Task<Club> CreateAsync(Club club, CancellationToken cancellationToken)
    {
        _context.Clubs.Add(club);
        await _context.SaveChangesAsync(cancellationToken);
        return club;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var club = await _context.Clubs.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

        if (club == null)
            return false;

        _context.Clubs.Remove(club);
        return await _context.SaveChangesAsync(cancellationToken) > 0;
    }

    public async Task<List<Club>> GetAllAsync(string? filter, CancellationToken cancellationToken)
    {
        var query = _context.Clubs
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(filter))
        {
            filter = filter.Trim();

            query = query.Where(c =>
                (c.Name != null && c.Name.ToLower().Contains(filter.ToLower())) ||
                (c.City != null && c.City.ToLower().Contains(filter.ToLower())) ||
                (c.Alias != null && c.Alias.ToLower().Contains(filter.ToLower())));
        }

        query = query
          .OrderBy(c => c.Order)
          .ThenBy(c => c.Name);

        return await query.ToListAsync(cancellationToken);
    }

    public async Task<Club?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.Clubs
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<bool> IsExist(Guid id, CancellationToken cancellationToken)
    {
        return await _context.Clubs.AnyAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<Club> UpdateAsync(Club club, CancellationToken cancellationToken)
    {
        _context.Clubs.Update(club);
        await _context.SaveChangesAsync(cancellationToken);
        return club;
    }

    public async Task<Club> GetByAliasAsync(
    string alias,
    CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(alias))
            return null;

        return await _context.Clubs
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Alias == alias, cancellationToken);
    }
}
