using BadmintonApp.Application.DTOs.Users;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Users
{
    public interface IUsersService
    {
        Task RegisterAsync(RegisterDto dto, CancellationToken cancellationToken);
        Task<UserResultDto> GetByIdAsync(Guid userId, CancellationToken cancellationToken);
        Task<List<UserResultDto>> GetAllAsync(string? filter, CancellationToken cancellationToken);
        Task<UserResultDto> UpdateAsync(Guid userId, UpdateUserDto dto, CancellationToken cancellationToken);
        Task DeleteAsync(Guid userId, CancellationToken cancellationToken);
    }
}
