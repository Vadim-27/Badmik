using BadmintonApp.Application.DTOs.Booking;
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
    [Route("api/players/{playerId:guid}/memberships")]
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
        public async Task<ActionResult<MembershipDto>> Create(Guid playerId, [FromBody] CreateMembershipDto dto, CancellationToken ct)
        {
            var membership = await _membershipService.CreateAsync(playerId, dto, ct);
            
            return CreatedAtAction(nameof(GetById), new { playerId, membershipId = membership.Id }, membership);
        }

        // PUT /players/{playerId}/memberships/{membershipId}
        [HttpPut("{membershipId:guid}")]
        public async Task<ActionResult<MembershipDto>> Update(Guid playerId, Guid membershipId, [FromBody] UpdateMembershipDto dto, CancellationToken ct)
        {
            var membership = await _membershipService.UpdateAsync(playerId, membershipId, dto, ct);
            return CreatedAtAction(nameof(GetById), new { playerId, membershipId = membership.Id }, membership);
        }

        // DELETE /players/{playerId}/memberships/{membershipId}
        [HttpDelete("{membershipId:guid}")]
        public async Task<IActionResult> Delete(Guid playerId, Guid membershipId, CancellationToken ct)
        {
            await _membershipService.DeleteAsync(playerId, membershipId, ct);
            return NoContent();
        }

        [HttpPost("renew")]
        public async Task<ActionResult<MembershipDto>> Renew(Guid playerId, [FromBody] RenewMembershipDto dto, CancellationToken ct)
        {
            var membership = await _membershipService.RenewAsync(playerId, dto, ct);
            return CreatedAtAction(nameof(GetById), new { playerId, membershipId = membership.Id }, membership);
        }

        [HttpPost("purchase")]
        public async Task<ActionResult<MembershipDto>> Purchase(Guid playerId, [FromBody] CreateMembershipPurchaseDto dto, CancellationToken ct)
        {
            // enforce route playerId
            dto.PlayerId = playerId;

            var created = await _membershipService.PurchaseAsync(dto, ct);

            return CreatedAtAction(nameof(GetById), new { playerId, membershipId = created.Id }, created);
        }
    }
}
