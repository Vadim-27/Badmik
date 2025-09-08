﻿using BadmintonApp.Application.DTOs.Auth;
using BadmintonApp.Application.Interfaces.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.API.Controllers;

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
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto, [FromServices] ILogger<AuthController> logger, CancellationToken cancellationToken)
    {
        logger.LogInformation("Hi!! Tests..");
        var result = await _authService.LoginAsync(loginDto, cancellationToken);
        //if (!result.IsSuccess)
        //    return Unauthorized();

        return Ok(result);
    }
}
