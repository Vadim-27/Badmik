﻿using BadmintonApp.API.Extensions;
using BadmintonApp.Application.DTOs.Player;
using BadmintonApp.Application.DTOs.Users;
using BadmintonApp.Application.Interfaces.Users;
using BadmintonApp.Domain.Core;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlayersController : ControllerBase
    {
        private readonly IUsersService _usersService;
        private readonly IValidator<PlayerRegisterDto> _registerDtoValidator;


        public PlayersController(IUsersService usersService, IValidator<PlayerRegisterDto> registerDtoValidator)
        {
            _usersService = usersService;
            _registerDtoValidator = registerDtoValidator;

        }

        // POST: /api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] PlayerRegisterDto registerDto, CancellationToken cancellationToken)
        {
            

            await _usersService.RegisterPlayerAsync(registerDto, cancellationToken);

            return Ok();
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetProfile(CancellationToken cancellationToken)
        {

            var user = await _usersService.GetByIdAsync(User.GetUserId(), cancellationToken);

            return Ok(user);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult> GetAll([FromQuery] string? filter, CancellationToken cancellationToken)
        {
            List<UserResultDto> users = await _usersService.GetAllAsync(filter, cancellationToken);
            return Ok(users);
        }

    } 
}
