using BadmintonApp.Application.DTOs.Trainings;
using BadmintonApp.Application.Interfaces.Trainings;
using BadmintonApp.Application.Validation;
using BadmintonApp.Domain.Trainings.Enums;
using FluentValidation;
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
        private readonly IValidator<CreateTrainingDto> _createTrainingValidator;
        private readonly IValidator<UpdateTrainingDto> _updateTrainingValidator;
        private readonly WorkingHourDtoValidator _workingHourValidator;

        public TrainingsController(ITrainingsService trainingsService,
            IValidator<CreateTrainingDto> createTrainingValidator, IValidator<UpdateTrainingDto> updateTrainingValidator, WorkingHourDtoValidator workingHourValidator)
        {
            _trainingsService = trainingsService;
            _createTrainingValidator = createTrainingValidator;
            _updateTrainingValidator = updateTrainingValidator;
            _workingHourValidator = workingHourValidator;
        }

        [HttpGet("GetAll")]
        public ActionResult GetAll(
            [FromQuery] Guid clubId,
            [FromQuery] DateTime? date,
            [FromQuery] TrainingType? type,
            [FromQuery] PlayerLevel? level)
        {
            var trainings = _trainingsService.GetAllAsync(clubId, date, type, level);
            return Ok(trainings);
        }

        [HttpGet("{id}/GetById")]
        public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            var training = await _trainingsService.GetByIdAsync(id, cancellationToken);
            if (training == null)
                return NotFound();

            return Ok(training);
        }

        [HttpPost("Create")]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateTrainingDto dto, CancellationToken cancellationToken)
        {
            await _createTrainingValidator.ValidateAndThrowAsync(dto, cancellationToken);                        

            var userId = Guid.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var created = await _trainingsService.CreateAsync(userId, dto, cancellationToken);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        [HttpPut("{id}/Update")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTrainingDto dto, CancellationToken cancellationToken)
        {
            await _updateTrainingValidator.ValidateAndThrowAsync(dto, cancellationToken);

            var userId = Guid.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var updated = await _trainingsService.UpdateAsync(id, userId, dto, cancellationToken);

            return Ok(updated);
        }

        [HttpDelete("{id}/Delete")]
        public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
        {
            var userId = Guid.Parse(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);

           await _trainingsService.DeleteAsync(id, userId, cancellationToken);

            return Ok();
        }

        [HttpPost("{id}/Cancel")]
        public async Task<IActionResult> Cancel(Guid id, CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            await _trainingsService.CancelAsync(id, Guid.Parse(userId), cancellationToken);

            return Ok();
        }

        [HttpPost("{id}/JoinQueue")]
        public async Task<IActionResult> JoinQueue(Guid id, CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

           await _trainingsService.JoinQueueAsync(id, Guid.Parse(userId), cancellationToken);

            return Ok();
        }

        [HttpDelete("{id}/LeaveQueue")]
        public async Task<IActionResult> LeaveQueue(Guid id, CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            await _trainingsService.LeaveQueueAsync(id, Guid.Parse(userId), cancellationToken);

            return Ok();
        }

        [HttpGet("{id}/GetParticipants")]
        public async Task<IActionResult> GetParticipants(Guid id, CancellationToken cancellationToken)
        {
            var result = await _trainingsService.GetParticipantsAsync(id, cancellationToken);
            return Ok(result);
        }

        [HttpGet("{id}/GetQueue")]
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


//{
//    "email": "string",
//  "password": "string",
//  "firstName": "string",
//  "lastName": "string",
//  "role": "string",
//  "doB": "2025-08-13T17:46:36.685Z"
//}