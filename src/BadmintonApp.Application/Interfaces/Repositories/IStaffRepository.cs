using BadmintonApp.Application.DTOs.Staff;
using BadmintonApp.Domain.Clubs;
using BadmintonApp.Domain.Core;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories;

public interface IStaffRepository
{
    Task Registration(Staff staff, CancellationToken cancellationToken);
    Task Update(Staff staff, CancellationToken cancellationToken);
    Task<Staff> GetById(Guid id, CancellationToken cancellationToken);
    Task<List<Staff>> GetAll(CancellationToken cancellationToken);
}
