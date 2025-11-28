using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Application.DTOs.WorkingHourDtos;
using BadmintonApp.Application.Interfaces.Clubs;
using BadmintonApp.Application.Validation;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.API.Controllers
{
    [ApiController]
    [Route("api/clubs")]
    public class ClubsController : ControllerBase
    {
        private readonly IClubsService _clubsService;
        private readonly IValidator<CreateClubDto> _createClubValidation;
        private readonly IValidator<UpdateClubDto> _updateClubValidation;
        private readonly IValidator<WorkingHourDto> _workingHourDtoValidator;

        public ClubsController(IClubsService clubsService, IValidator<CreateClubDto> createClubValidation, IValidator<UpdateClubDto> updateClubValidation, IValidator<WorkingHourDto> workingHourDtoValidator
            )
        {
            _clubsService = clubsService;
            _createClubValidation = createClubValidation;
            _updateClubValidation = updateClubValidation;
            _workingHourDtoValidator = workingHourDtoValidator;
        }

        [HttpPost]
        public async Task<ActionResult<ClubResultDto>> Create(
        [FromBody] CreateClubDto dto,
        CancellationToken cancellationToken)
        {
            // All validation is done inside the service (FluentValidation)
            var result = await _clubsService.CreateAsync(dto, cancellationToken);

            // Returns 201 Created with location header
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        [HttpGet]
        public async Task<ActionResult<List<ClubResultDto>>> GetAll(
        [FromQuery] string? filter,
        CancellationToken cancellationToken)
        {
            var result = await _clubsService.GetAllAsync(filter, cancellationToken);
            return Ok(result);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<ClubResultDto>> Update(
        Guid id,
        [FromBody] UpdateClubDto dto,
        CancellationToken cancellationToken)
        {
            // Validation is done inside the service
            var result = await _clubsService.UpdateAsync(id, dto, cancellationToken);
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ClubResultDto>> GetById(
        Guid id,
        CancellationToken cancellationToken)
        {
            var clubs = await _clubsService.GetAllAsync(null, cancellationToken);
            var club = clubs.FirstOrDefault(c => c.Id == id);

            if (club == null)
                return NotFound();

            return Ok(club);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(
        Guid id,
        CancellationToken cancellationToken)
        {
            await _clubsService.DeleteAsync(id, cancellationToken);
            return NoContent(); // 204
        }

        [HttpPost("{id:guid}/deactivate")]
        public async Task<IActionResult> Deactivate(
        Guid id,
        CancellationToken cancellationToken)
        {
            await _clubsService.DeactivateAsync(id, cancellationToken);
            return NoContent();
        }

        [HttpPost("{id:guid}/activate")]
        public async Task<IActionResult> Activate(
        Guid id,
        CancellationToken cancellationToken)
        {
            await _clubsService.ActivateAsync(id, cancellationToken);
            return NoContent();
        }

    }
}
