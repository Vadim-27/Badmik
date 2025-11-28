using Microsoft.AspNetCore.Mvc;

namespace BadmintonApp.API.Controllers
{
    using BadmintonApp.Application.DTOs.Clubs;
    using Microsoft.AspNetCore.Mvc;
    using System;
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;
    using BadmintonApp.Application.Services;
    using BadmintonApp.Application.Interfaces.Clubs;

    [ApiController]
    [Route("api/[controller]")]
    public class LocationsController : ControllerBase
    {
        private readonly ILocationService _locationsService;

        public LocationsController(ILocationService locationsService)
        {
            _locationsService = locationsService;
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<LocationResultDto>> GetById(
            Guid id,
            CancellationToken cancellationToken)
        {
            var result = await _locationsService.GetByIdAsync(id, cancellationToken);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpGet("by-club/{clubId:guid}")]
        public async Task<ActionResult<List<LocationResultDto>>> GetByClub(
            Guid clubId,
            CancellationToken cancellationToken)
        {
            var result = await _locationsService.GetByClubIdAsync(clubId, cancellationToken);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<LocationResultDto>> Create(
            [FromBody] CreateLocationDto dto,
            CancellationToken cancellationToken)
        {
            // All validation (including WorkingHours, Courts, etc.) is done inside the service
            var result = await _locationsService.CreateAsync(dto, cancellationToken);

            // If you want to be REST-strict: use CreatedAtAction, but you preferred Ok
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<LocationResultDto>> Update(
            Guid id,
            [FromBody] UpdateLocationDto dto,
            CancellationToken cancellationToken)
        {
            var result = await _locationsService.UpdateAsync(id, dto, cancellationToken);
            return Ok(result);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(
            Guid id,
            CancellationToken cancellationToken)
        {
            await _locationsService.DeleteAsync(id, cancellationToken);
            return NoContent();
        }
    }
}
