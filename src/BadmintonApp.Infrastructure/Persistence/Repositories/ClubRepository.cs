using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Clubs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
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
    public async Task<bool> AssignAdminAsync(Guid clubId, Guid userId, CancellationToken cancellationToken)
    {
        if (await _context.UserClubRoles
            .AnyAsync(x => x.ClubId == clubId &&
                           x.UserId == userId &&
                           x.Role == RoleType.ClubAdmin))
        {
            return true;
        }

        await _context.UserClubRoles.AddAsync(new UserClubRole
        {
            ClubId = clubId,
            UserId = userId,
            Role = RoleType.ClubAdmin
        }, cancellationToken);

        return await _context.SaveChangesAsync(cancellationToken) > 0;
    }

    public async Task<Club> CreateAsync(Club club, CancellationToken cancellationToken)
    {

        await _context.Clubs.AddAsync(club, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return club;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var club = await _context.Clubs.FindAsync(id, cancellationToken);
        _context.Clubs.Remove(club);
        return await _context.SaveChangesAsync(cancellationToken) > 0;
    }

    public async Task<List<Club>> GetAllAsync(string filter = null, CancellationToken cancellationToken = default)
    {
        return await _context.Clubs
            .AsNoTracking()
            .Include(x=>x.WorkingHours)
            .ToListAsync(cancellationToken);
    }

    public async Task<Club> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.Clubs
         .AsNoTracking()
         .Include(c => c.WorkingHours)
         .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<Club> UpdateAsync(Club club, CancellationToken cancellationToken)
    {
        _context.Clubs.Update(club);
        await _context.SaveChangesAsync(cancellationToken);
        return club;
    }
}
