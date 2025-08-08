using BadmintonApp.API.Exceptions;
using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Application.Interfaces.Clubs;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClubsController : ControllerBase
    {
        private readonly IClubsService _clubsService;

        public ClubsController(IClubsService clubsService)
        {
            _clubsService = clubsService;
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CreateClubDto create, CancellationToken cancellationToken)
        {
            var result = await _clubsService.CreateAsync(create, cancellationToken);

            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult> GetAll ([FromQuery] string? filter, CancellationToken cancellationToken)
        {
            var res = _clubsService.GetAllAsync(filter, cancellationToken); //?

            return Ok(res);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(Guid id, [FromBody] UpdateClubDto dto, CancellationToken cancellationToken)
        {
            var result = await _clubsService.UpdateAsync(id, dto, cancellationToken);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            var deleted = await _clubsService.DeleteAsync(id, cancellationToken);
            if (!deleted.IsSuccess)
                return ExceptionFactory.NotFound("Клуб не знайдено");

            return NoContent(); // 204
        }

        [HttpPut("{clubId}/assign-admin")]
        public async Task<IActionResult> AssignAdmin(Guid clubId, [FromBody] AssignAdminDto dto, CancellationToken cancellationToken)
        {
            var result = await _clubsService.AssignAdminAsync(clubId, dto.UserId, cancellationToken);
            if (!result.IsSuccess)
                return NotFound();

            return NoContent();
        }
    }
}
