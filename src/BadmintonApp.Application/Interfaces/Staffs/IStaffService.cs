using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Logs;
using BadmintonApp.Application.DTOs.Paginations;
using BadmintonApp.Application.DTOs.Staff;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Staffs;

public interface IStaffService
{
    Task Update(StaffUpdateDto staffUpdateDto, CancellationToken cancellationToken);
    Task RegisterStaffAsync(StaffRegisterDto dto, CancellationToken cancellationToken);
    Task<StaffDto> GetById(Guid id, CancellationToken cancellationToken);
    Task<StaffDto> GetByUserId(Guid id, CancellationToken cancellationToken);
    Task<PaginationListDto<StaffDto>> GetAll(ClubPaginationFilterDto paginationFilterDto, CancellationToken cancellationToken);
    Task ChangePassword(StaffUpdatePasswordDto staffUpdateDto, CancellationToken cancellationToken);
}
