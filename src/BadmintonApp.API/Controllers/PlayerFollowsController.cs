using BadmintonApp.Application.DTOs.Player;
using BadmintonApp.Application.Interfaces.Players;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/players/{playerId:guid}")]
    public class PlayerFollowsController : ControllerBase
    {
        private readonly IPlayerFollowService _service;

        public PlayerFollowsController(IPlayerFollowService service)
        {
            _service = service;
        }

        // GET /players/{playerId}/following
        [HttpGet("following")]
        public async Task<ActionResult<List<PlayerFollowItemDto>>> GetFollowing(Guid playerId, CancellationToken ct)
        {
            var result = await _service.GetFollowings(playerId, ct);
            return Ok(result);
        }

        // GET /players/{playerId}/followers
        [HttpGet("followers")]
        public async Task<ActionResult<List<PlayerFollowItemDto>>> GetFollowers(Guid playerId, CancellationToken ct)
        {
            var result = await _service.GetFollowers(playerId, ct);
            return Ok(result);
        }

        // PUT /players/{playerId}/following/{targetPlayerId}
        [HttpPut("following/{targetPlayerId:guid}")]
        public async Task<IActionResult> Follow(Guid playerId, Guid targetPlayerId, CancellationToken ct)
        {
            await _service.AddSubscription(playerId, targetPlayerId, ct);
            return NoContent();
        }

        // DELETE /players/{playerId}/following/{targetPlayerId}
        [HttpDelete("following/{targetPlayerId:guid}")]
        public async Task<IActionResult> Unfollow(Guid playerId, Guid targetPlayerId, CancellationToken ct)
        {
            await _service.RemoveSubscription(playerId, targetPlayerId, ct);
            return NoContent();
        }
    }
}
