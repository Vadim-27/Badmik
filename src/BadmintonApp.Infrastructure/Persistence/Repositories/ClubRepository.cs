using BadmintonApp.Application.Interfaces;
using BadmintonApp.Domain.Clubs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Repositories;

public class ClubRepository : IClubsRepository
{
    private readonly ApplicationDbContext _context;

    public ClubRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    public async Task<bool> AssignAdminAsync(Guid clubId, Guid userId)
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
        });

        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<Club> CreateAsync(Club club)
    {

        await _context.Clubs.AddAsync(club);
        await _context.SaveChangesAsync();
        return club;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var club = await _context.Clubs.FindAsync(id);
        _context.Clubs.Remove(club);
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<List<Club>> GetAllAsync(string filter = null)
    {
        return await _context.Clubs
            .AsNoTracking()
            .Include(x=>x.WorkingHours)
            .ToListAsync();
    }

    public async Task<Club> GetByIdAsync(Guid id)
    {
        return await _context.Clubs
         .AsNoTracking()
         .Include(c => c.WorkingHours)
         .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Club> UpdateAsync(Club club)
    {
        _context.Clubs.Update(club);
        await _context.SaveChangesAsync();
        return club;
    }
}
