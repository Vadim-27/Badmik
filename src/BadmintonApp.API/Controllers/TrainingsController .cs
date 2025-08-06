using BadmintonApp.Application.DTOs.Trainings;
using BadmintonApp.Application.Interfaces.Trainings;
using BadmintonApp.Domain.Trainings.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrainingsController : ControllerBase
    {
        private readonly ITrainingsService _trainingsService;

        public TrainingsController(ITrainingsService trainingsService)
        {
            _trainingsService = trainingsService;
        }

        [HttpGet]
        public async Task<ActionResult> GetAll(
            [FromQuery] Guid clubId,
            [FromQuery] DateTime? date,
            [FromQuery] TrainingType? type,
            [FromQuery] PlayerLevel? level)
        {
            var trainings = await _trainingsService.GetAllAsync(clubId, date, type, level);
            return Ok(trainings);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var training = await _trainingsService.GetByIdAsync(id, cancellationToken);
            if (training == null)
                return NotFound();

            return Ok(training);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateTrainingDto dto, CancellationToken cancellationToken)
        {
            var userId = Guid.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var created = await _trainingsService.CreateAsync(userId, dto, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTrainingDto dto, CancellationToken cancellationToken)
        {
            var updated = await _trainingsService.UpdateAsync(id, dto, cancellationToken);
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            var result = await _trainingsService.DeleteAsync(id, cancellationToken);
            if (!result.IsSuccess)
                return BadRequest(result.Message);

            return NoContent();
        }

        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> Cancel(Guid id, CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _trainingsService.CancelAsync(id, Guid.Parse(userId), cancellationToken);
            if (!result.IsSuccess)
                return BadRequest(result.Message);

            return Ok(result);
        }

        [HttpPost("{id}/queue")]
        public async Task<IActionResult> JoinQueue(Guid id, CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _trainingsService.JoinQueueAsync(id, Guid.Parse(userId), cancellationToken);
            if (!result.IsSuccess)
                return BadRequest(result.Message);

            return Ok(result);
        }

        [HttpDelete("{id}/queue")]
        public async Task<IActionResult> LeaveQueue(Guid id, CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var result = await _trainingsService.LeaveQueueAsync(id, Guid.Parse(userId), cancellationToken);
            if (!result.IsSuccess)
                return BadRequest(result.Message);

            return Ok(result);
        }

        [HttpGet("{id}/participants")]
        public async Task<IActionResult> GetParticipants(Guid id, CancellationToken cancellationToken)
        {
            var result = await _trainingsService.GetParticipantsAsync(id, cancellationToken);
            return Ok(result);
        }

        [HttpGet("{id}/queue")]
        public async Task<IActionResult> GetQueue(Guid id, CancellationToken cancellationToken)
        {
            var result = await _trainingsService.GetQueueAsync(id, cancellationToken);
            return Ok(result);
        }

    }
}

//{
//    "type": "Kids",
//  "date": "2025-08-06T18:02:11.651Z",
//  "startTime": "11:00",
//  "endTime": "13:00",
//  "isRecurringWeekly": true,
//  "courtsUsed": 2,
//  "maxPlayers": 2,
//  "trainerId": "4DC0F4F1-66FE-4724-A04C-455F8B8FED6F",
//  "allowedLevels": [
//    "D"
//  ]
//}
