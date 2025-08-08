using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;
using BadmintonApp.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.InteropServices;
using BadmintonApp.Application.DTOs.Auth;
using BadmintonApp.Application.Interfaces.Auth;
using System.Threading;

namespace BadmintonApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        

        // POST: /api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto, CancellationToken cancellationToken)
        {
            var result = await _authService.LoginAsync(loginDto, cancellationToken);
            if (!result.IsSuccess)
                return Unauthorized();

            return Ok(result);
        }
    }
}
