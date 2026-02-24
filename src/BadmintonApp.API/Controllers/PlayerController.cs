using BadmintonApp.API.Extensions;
using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Media;
using BadmintonApp.Application.DTOs.Player;
using BadmintonApp.Application.DTOs.Users;
using BadmintonApp.Application.Interfaces.Media;
using BadmintonApp.Application.Interfaces.Players;
using BadmintonApp.Application.Interfaces.Users;
using BadmintonApp.Application.Services;
using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Media;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.API.Controllers
{
    [ApiController]
    [Route("api/players")]
    public class PlayerController : ControllerBase 
    {
        private readonly IUsersService _usersService;
        private readonly IPlayerService _playerService;
        private readonly IMediaService _media;

        public PlayerController(IUsersService usersService, IPlayerService playerService, IMediaService media)
        {
            _usersService = usersService;
            _playerService = playerService;
            _media  = media;
        }

        // POST: /api/auth/register
        [HttpPost("")]
        public async Task<IActionResult> Create([FromBody] CreatePlayerDto registerDto, CancellationToken cancellationToken)
        {
            await _playerService.Create(registerDto, cancellationToken);

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
        public async Task<ActionResult> GetAll([FromQuery] ClubPaginationFilterDto paginationFilterDto, CancellationToken cancellationToken)
        {
            var users = await _playerService.GetAll(paginationFilterDto, cancellationToken);
            return Ok(users);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var result = await _playerService.GetById(id, cancellationToken);
            return Ok(result);
        }

        [HttpGet("user/{id:guid}")]
        public async Task<ActionResult> GetByUserId(Guid id, CancellationToken cancellationToken)
        {
            var result = await _playerService.GetByUserId(id, cancellationToken);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update([FromBody] UpdatePlayerDto dto, CancellationToken cancellationToken)
        {
            await _playerService.Update(dto, cancellationToken);
            return Ok();
        }

        [HttpPut("{id:guid}/photo")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<MediaItemDto>> UploadPhoto(Guid id, IFormFile file, CancellationToken ct)
        {
            if (file == null || file.Length == 0) return BadRequest("File is required.");
            var player = await _playerService.GetById(id, ct);
            if (player == null)
            {
                return NotFound("Player not found.");
            }

            var result = await _media.UploadSingleAsync(EntityType.Player, id, MediaKind.Avatar, file, ct);

            return Ok(result);
        }

        [HttpDelete("{id:guid}/photo")]
        public async Task<IActionResult> DeletePhoto(Guid id, CancellationToken ct)
        {
            await _media.DeleteSingleAsync(EntityType.Player, id, MediaKind.Avatar, ct);
            return NoContent();
        }

        [HttpGet("{id:guid}/logo")]
        public async Task<ActionResult<MediaItemDto?>> GetPhoto(Guid id, CancellationToken ct)
        {
            var items = await _media.GetAsync(EntityType.Location, id, MediaKind.Logo, ct);
            return Ok(items.FirstOrDefault()); 
        }

        [HttpPut("{playerId:guid}/sport-profiles")]
        public async Task<IActionResult> UpdateSportProfiles(Guid playerId, [FromBody] UpdatePlayerSportProfilesDto dto, CancellationToken cancellationToken)
        {
            await _playerService.UpdateSportProfilesAsync(playerId, dto, cancellationToken);
            return NoContent();
        }

        [HttpPost("query")]
        public async Task<ActionResult<List<PlayerDto>>> Query([FromBody] List<Guid> ids, CancellationToken ct)
        {
            if (ids == null || ids.Count == 0)
                return Ok(new List<PlayerDto>());

            var players = await _playerService.GetByIdsAsync(ids, ct);
            return Ok(players);
        }
    }
}
