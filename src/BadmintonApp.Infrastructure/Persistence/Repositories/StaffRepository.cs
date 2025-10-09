using BadmintonApp.Application.DTOs.Staff;
using BadmintonApp.Application.Interfaces.Staffs;
using BadmintonApp.Domain.Core;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
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
        staff.CreatedAt = DateTime.Now;
        await _dbContext.AddAsync(staff, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task Update(Staff staff, CancellationToken cancellationToken)
    {

        var staffUpdate = await _dbContext.Staffs
            .AsNoTracking()
            .FirstAsync(x => x.Id == staff.Id, cancellationToken);

        staff.CreatedAt = staffUpdate.CreatedAt;
        staff.UpdatedAt = DateTime.Now;
        staff.UserId = staffUpdate.UserId;

        _dbContext.Staffs.Update(staff);
        await _dbContext.SaveChangesAsync(cancellationToken);

    }

    public async Task<Staff> GetById(Guid id, CancellationToken cancellationToken)
    {
        return await _dbContext.Staffs
           .AsNoTracking()
           .FirstAsync(x => x.Id == id, cancellationToken);              
    }

    public async Task<List<Staff>> GetAll(CancellationToken cancellationToken)
    {
        return await _dbContext.Staffs
            .AsNoTracking()
            .Include(x => x.User)                       
            .ToListAsync(cancellationToken);
    }
}
