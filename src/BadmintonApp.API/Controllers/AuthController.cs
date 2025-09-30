using BadmintonApp.Application.DTOs.Auth;
using BadmintonApp.Application.Interfaces.Auth;
using BadmintonApp.Application.UseCases.Account.Commands.Login;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{    
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {        
        _mediator = mediator;
    }

    
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto, [FromServices] ILogger<AuthController> logger, CancellationToken cancellationToken)
    {
        var loginCommand = new LoginCommand
        {
            Email = loginDto.Email,
            Password = loginDto.Password,
        };

        var result = await _mediator.Send(loginCommand, cancellationToken);       

        return Ok(result);
    }
}
