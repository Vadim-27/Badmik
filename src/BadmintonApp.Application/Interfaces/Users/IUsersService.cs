using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Users
{
    public interface IUsersService
    {
        Task<UserResultDto> RegisterAsync(RegisterDto dto, CancellationToken cancellationToken);                
        Task<UserResultDto> GetByIdAsync(Guid userId, CancellationToken cancellationToken);             
        Task<List<UserResultDto>> GetAllAsync(CancellationToken cancellationToken);                      
        Task<UserResultDto> UpdateAsync(Guid userId, UpdateUserDto dto, CancellationToken cancellationToken); 
        Task<ResultDto> DeleteAsync(Guid userId, CancellationToken cancellationToken);
    }
}
