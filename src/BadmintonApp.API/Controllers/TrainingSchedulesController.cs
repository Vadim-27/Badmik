using BadmintonApp.Application.DTOs.Trainings;
using BadmintonApp.Application.Interfaces.Auth;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Application.Interfaces.Trainings;
using BadmintonApp.Domain.Trainings;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.API.Controllers
{
    [ApiController]
    [Route("api/training-schedules")]
    public class TrainingSchedulesController : ControllerBase
    {
        private readonly ITrainingScheduleService _scheduleService;
        private readonly ITrainingScheduleRepository _scheduleRepo;
        private readonly ICurrentUserContext _current;

        public TrainingSchedulesController(
            ITrainingScheduleService scheduleService,
            ITrainingScheduleRepository scheduleRepo, 
            ICurrentUserContext current)
        {
            _scheduleService = scheduleService;
            _scheduleRepo = scheduleRepo;
            _current = current;
        }

        // -------- Reads --------

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<TrainingSchedule>> GetById(Guid id, CancellationToken ct)
        {
            var schedule = await _scheduleRepo.GetByIdAsync(id, ct);
            if (schedule is null) return NotFound();
            return Ok(schedule);
        }

        [HttpGet("club/{clubId:guid}/active")]
        public async Task<ActionResult<List<TrainingSchedule>>> GetActiveByClub(Guid clubId, CancellationToken ct)
        {
            var list = await _scheduleRepo.GetActiveByClubAsync(clubId, ct);
            return Ok(list);
        }

        // -------- Commands --------

        [HttpPost]
        public async Task<ActionResult<Guid>> Create([FromBody] CreateOrUpdateScheduleDto dto, CancellationToken ct)
        {
            // Expect dto has CreatedByUserId (or provide separately)
            var id = await _scheduleService.CreateAsync(dto, _current.UserId, ct);
            return Ok(id);
        }

        [HttpPut("{scheduleId:guid}")]
        public async Task<IActionResult> Update(Guid scheduleId, [FromBody] CreateOrUpdateScheduleDto dto, CancellationToken ct)
        {
            await _scheduleService.UpdateAsync(scheduleId, dto, _current.UserId, ct);
            return NoContent();
        }

        [HttpPost("{scheduleId:guid}/deactivate")]
        public async Task<IActionResult> Deactivate(Guid scheduleId, CancellationToken ct)
        {
            await _scheduleService.DeactivateAsync(scheduleId, _current.UserId, ct);
            return NoContent();
        }

        [HttpPost("club/{clubId:guid}/generate")]
        public async Task<ActionResult<int>> GenerateWeeklySessions(
            Guid clubId,
            [FromBody] GenerateWeeklySessionsDto dto,
            CancellationToken ct)
        {
            var count = await _scheduleService.GenerateWeeklySessionsAsync(
                clubId,
                dto.FromDate,
                dto.ToDate,
                dto.CreatedByUserId,
                ct);

            return Ok(count);
        }

        [HttpPost("{scheduleId:guid}/create-session")]
        public async Task<ActionResult<Guid>> CreateSessionFromSchedule(
            Guid scheduleId,
            [FromBody] CreateSessionFromScheduleDto dto,
            CancellationToken ct)
        {
            // If CreateSessionFromScheduleDto contains ScheduleId, enforce it:
            dto.ScheduleId = scheduleId;

            var id = await _scheduleService.CreateSessionFromScheduleAsync(dto, _current.UserId, ct);
            return Ok(id);
        }
    }
}
