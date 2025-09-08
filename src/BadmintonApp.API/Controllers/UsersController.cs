using BadmintonApp.Application.DTOs.Users;
using BadmintonApp.Application.Interfaces.Users;
using BadmintonApp.Application.Validation;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _usersService;
        private readonly IValidator<RegisterDto> _registerDtoValidator;
        

        public UsersController(IUsersService usersService, IValidator<RegisterDto> registerDtoValidator )
        {
            _usersService = usersService;
            _registerDtoValidator = registerDtoValidator;
            
        }

        // POST: /api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto, CancellationToken cancellationToken)
        {
            await _registerDtoValidator.ValidateAndThrowAsync(registerDto, cancellationToken);

            await _usersService.RegisterAsync(registerDto, cancellationToken);
            
            return Ok();
        }

        // GET: /api/users/me
        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetProfile(CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await _usersService.GetByIdAsync(Guid.Parse(userId), cancellationToken);
            if (user == null)
                return NotFound();

            return Ok(user);
        }
    }
}
