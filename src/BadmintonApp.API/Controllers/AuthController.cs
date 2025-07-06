using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;
using BadmintonApp.Application.DTOs;
using BadmintonApp.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.InteropServices;
using BadmintonApp.Application.DTOs.Auth;

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
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);
            if (!result.IsSuccess)
                return Unauthorized();

            return Ok(result);
        }
    }
}
