using BadmintonApp.Application.DTOs.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Auth
{
    public interface IAuthService
    {
        Task<LoginResultDto> LoginAsync(LoginDto dto, CancellationToken cancellationToken);
        Task LogoutAsync();
    }
}
