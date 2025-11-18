using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Paginations;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Core;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Repositories;

public class StaffRepository : IStaffRepository
{
    private readonly ApplicationDbContext _dbContext;

    public StaffRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }


    public async Task Registration(Staff staff, CancellationToken cancellationToken)
    {
        staff.CreatedAt = DateTime.UtcNow;
        
        await _dbContext.AddAsync(staff, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task Update(Staff staff, CancellationToken cancellationToken)
    {

        var currentStaff = await _dbContext.Staffs
            .AsNoTracking()
            .FirstAsync(x => x.Id == staff.Id, cancellationToken);

        staff.CreatedAt = currentStaff.CreatedAt;
        staff.UpdatedAt = DateTime.UtcNow;
        staff.UserId = currentStaff.UserId;

        _dbContext.Staffs.Update(staff);
        await _dbContext.SaveChangesAsync(cancellationToken);

    }

    public async Task<Staff> GetById(Guid id, CancellationToken cancellationToken)
    {
        return await _dbContext.Staffs
           .AsNoTracking()
           .Include(x => x.User)
           .FirstAsync(x => x.Id == id, cancellationToken);
    }

    public async Task<Staff> GetByUserId(Guid id, CancellationToken cancellationToken)
    {
        return await _dbContext.Staffs
           .AsNoTracking()
           .Include(x => x.User)
           .FirstAsync(x => x.UserId == id, cancellationToken);
    }

    public async Task<Staff> GetByUserAndClubId(Guid userId, Guid clubId, CancellationToken cancellationToken)
    {
        return await _dbContext.Staffs
           .AsNoTracking()
           .Where(x => x.ClubId == clubId)
           .Include(x => x.User)
           .FirstAsync(x => x.UserId == userId, cancellationToken);
    }

    public async Task<PaginationListDto<Staff>> GetAll(ClubPaginationFilterDto paginationFilterDto, CancellationToken cancellationToken)
    {
        var query = _dbContext.Staffs
            .AsNoTracking()
            .Include(x => x.User)
            .Include(x => x.WorkingHours)
            .OrderBy(x => x.User.LastName)
            .AsQueryable();

        if (paginationFilterDto.ClubId.HasValue)
        {
            query = query.Where(x => x.ClubId == paginationFilterDto.ClubId.Value);
        }
        

        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Skip((paginationFilterDto.Page - 1) * paginationFilterDto.PageSize)
            .Take(paginationFilterDto.PageSize)
            .ToListAsync(cancellationToken);

        return new PaginationListDto<Staff>
        {
            List = items,
            TotalCount = totalCount,
            Page = paginationFilterDto.Page,
            PageSize = paginationFilterDto.PageSize


        };
    }
}
