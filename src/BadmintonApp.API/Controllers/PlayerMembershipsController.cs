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
    [Route("players/{playerId:guid}/memberships")]
    [Authorize]
    public class PlayerMembershipsController : Controller
    {
        private readonly IPlayerMembershipService _membershipService;

        public PlayerMembershipsController(IPlayerMembershipService membershipService)
        {
            _membershipService = membershipService;
        }

        // GET /players/{playerId}/memberships?clubId=...
        [HttpGet]
        public async Task<ActionResult<List<MembershipDto>>> GetAll(Guid playerId,  [FromQuery] Guid? clubId, CancellationToken ct)
        {
            var result = await _membershipService.GetAllAsync(playerId, clubId, ct);
            return Ok(result);
        }

        // GET /players/{playerId}/memberships/{membershipId}
        [HttpGet("{membershipId:guid}")]
        public async Task<ActionResult<MembershipDto>> GetById(Guid playerId,  Guid membershipId, CancellationToken ct)
        {
            var result = await _membershipService.GetByIdAsync(playerId, membershipId, ct);
            return Ok(result);
        }

        // POST /players/{playerId}/memberships
        [HttpPost]
        public async Task<IActionResult> Create(Guid playerId, [FromBody] CreateMembershipDto dto, CancellationToken ct)
        {
            var membershipId = await _membershipService.CreateAsync(playerId, dto, ct);

            return CreatedAtAction(
                nameof(GetById),
                new { playerId, membershipId },
                null);
        }

        // PUT /players/{playerId}/memberships/{membershipId}
        [HttpPut("{membershipId:guid}")]
        public async Task<IActionResult> Update(Guid playerId, Guid membershipId, [FromBody] UpdateMembershipDto dto, CancellationToken ct)
        {
            await _membershipService.UpdateAsync(playerId, membershipId, dto, ct);
            return NoContent();
        }

        // DELETE /players/{playerId}/memberships/{membershipId}
        [HttpDelete("{membershipId:guid}")]
        public async Task<IActionResult> Delete(Guid playerId, Guid membershipId, CancellationToken ct)
        {
            await _membershipService.DeleteAsync(playerId, membershipId, ct);
            return NoContent();
        }

        // GET /players/{playerId}/memberships?clubId=...
        [HttpGet]
        public async Task<ActionResult<List<MembershipDto>>> GetByPlayerId(Guid playerId, [FromQuery] Guid? clubId, CancellationToken ct) 
        {
            var result = await _membershipService.GetAllAsync(playerId, clubId, ct);
            return Ok(result);
        }
    }
}
