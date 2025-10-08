using BadmintonApp.Application.DTOs.Staff;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Staffs;

public interface IStaffService
{
    Task Update(StaffUpdateDto staffUpdateDto, CancellationToken cancellationToken);
    Task<StaffDto> GetById(Guid id, CancellationToken cancellationToken);
    Task<List<StaffDto>> GetAll(CancellationToken cancellationToken);
}
