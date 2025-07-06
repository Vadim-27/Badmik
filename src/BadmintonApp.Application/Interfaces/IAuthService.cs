using BadmintonApp.Application.DTOs.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResultDto> LoginAsync(LoginDto dto);
        Task LogoutAsync();
    }
}
