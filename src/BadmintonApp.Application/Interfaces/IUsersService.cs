using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces
{
    public interface IUsersService
    {
        Task<UserResultDto> RegisterAsync(RegisterDto dto);                
        Task<UserResultDto> GetByIdAsync(string userId);             
        Task<List<UserResultDto>> GetAllAsync();                      
        Task<UserResultDto> UpdateAsync(string userId, UpdateUserDto dto); 
        Task<ResultDto> DeleteAsync(string userId);
    }
}
