using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Application.Interfaces;
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
            var result = await _clubsService.CreateAsync(create);

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
            var result = await _clubsService.UpdateAsync(id, dto);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            var deleted = await _clubsService.DeleteAsync(id);
            if (!deleted.IsSuccess)
                return NotFound(deleted.Message);

            return NoContent(); // 204
        }

        [HttpPut("{clubId}/assign-admin")]
        public async Task<IActionResult> AssignAdmin(Guid clubId, [FromBody] AssignAdminDto dto, CancellationToken cancellationToken)
        {
            var result = await _clubsService.AssignAdminAsync(clubId, dto.UserId);
            if (!result.IsSuccess)
                return NotFound();

            return NoContent();
        }


    }
}
