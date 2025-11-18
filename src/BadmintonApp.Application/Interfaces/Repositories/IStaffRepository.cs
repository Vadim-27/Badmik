using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Logs;
using BadmintonApp.Application.DTOs.Paginations;
using BadmintonApp.Application.DTOs.Staff;
using BadmintonApp.Domain.Clubs;
using BadmintonApp.Domain.Core;
using BadmintonApp.Domain.Logs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories;

public interface IStaffRepository
{
    Task Registration(Staff staff, CancellationToken cancellationToken);
    Task Update(Staff staff, CancellationToken cancellationToken);
    Task<Staff> GetById(Guid id, CancellationToken cancellationToken);
    Task<Staff> GetByUserAndClubId(Guid id, Guid clubId, CancellationToken cancellationToken);
    Task<PaginationListDto<Staff>> GetAll(ClubPaginationFilterDto paginationFilterDto, CancellationToken cancellationToken);
}
