using BadmintonApp.API.Extensions;
using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Player;
using BadmintonApp.Application.DTOs.Users;
using BadmintonApp.Application.Interfaces.Players;
using BadmintonApp.Application.Interfaces.Users;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.API.Controllers
{
    [ApiController]
    [Route("api/players")]
    public class PlayerController : ControllerBase 
    {
        private readonly IUsersService _usersService;
        private readonly IValidator<PlayerRegisterDto> _registerDtoValidator;
        private readonly IPlayerService _playerService;

        public PlayerController(IUsersService usersService, IValidator<PlayerRegisterDto> registerDtoValidator, IPlayerService playerService)
        {
            _usersService = usersService;
            _registerDtoValidator = registerDtoValidator;
            _playerService = playerService;
        }

        // POST: /api/auth/register
        [HttpPost("")]
        public async Task<IActionResult> Register([FromBody] PlayerRegisterDto registerDto, CancellationToken cancellationToken)
        {


            await _usersService.RegisterPlayerAsync(registerDto, cancellationToken);

            return Ok();
        }        

        //[Authorize]
        [HttpGet("Me")]
        public async Task<IActionResult> GetProfile(CancellationToken cancellationToken)
        {

            var user = await _usersService.GetByIdAsync(User.GetUserId(), cancellationToken);

            return Ok(user);
        }

        //[Authorize]
        [HttpGet("")]
        public async Task<ActionResult> GetAll([FromQuery] CancellationToken cancellationToken)
        {
            List<UserResultDto> users = await _usersService.GetAllAsync(cancellationToken);
            return Ok(users);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult> GetById(Guid id, CancellationToken cancellationToken)
        { 
            await _playerService.GetById(id, cancellationToken);
            return Ok();
        }

        [HttpGet("user/{id:guid}")]
        public async Task<ActionResult> GetByUserId(Guid id, CancellationToken cancellationToken)
        {
            await _playerService.GetByUserId(id, cancellationToken);
            return Ok();
        }

        [HttpPut("{id}")] // Повинен бути Апдейт аяк для користувача (обмежена), так і для адмінки (розширена)
        public async Task<ActionResult> Update([FromBody] PlayerUpdateDto dto, CancellationToken cancellationToken)
        {
            await _playerService.Update(dto, cancellationToken);
            return Ok();
        }
    }
}
