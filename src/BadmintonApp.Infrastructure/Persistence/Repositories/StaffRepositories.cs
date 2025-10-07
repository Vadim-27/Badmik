using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Application.Interfaces.Staffs;
using BadmintonApp.Domain.Clubs;
using BadmintonApp.Domain.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Repositories;

public class StaffRepositories : IStaffRepository
{
    private readonly ApplicationDbContext _dbContext;

    public StaffRepositories(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task Registration(Guid userId, List<WorkingHour> workingHourDtos, decimal salary, CancellationToken cancellationToken)
    {
        Staff staff = new Staff 
        {
             Id = Guid.NewGuid(),
              WorkingHours = workingHourDtos,

        };

        await _dbContext.AddAsync(userId, workingHourDtos, salary, cancellationToken);
    }
}
