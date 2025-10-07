using BadmintonApp.Domain.Clubs;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Staffs;

public interface IStaffRepository
{
    Task Registration(Guid userId, List<WorkingHour> workingHour, decimal salary, CancellationToken cancellationToken);
}
