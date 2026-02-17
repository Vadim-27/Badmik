using BadmintonApp.Application.DTOs.Trainings;
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
    [Route("api/training-sessions")]
    public class TrainingSessionsController : ControllerBase
    {
        private readonly ITrainingSessionService _sessionService;
        private readonly ITrainingSessionRepository _sessionRepo;

        public TrainingSessionsController(
            ITrainingSessionService sessionService,
            ITrainingSessionRepository sessionRepo)
        {
            _sessionService = sessionService;
            _sessionRepo = sessionRepo;
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<TrainingSession>> GetById(Guid id, CancellationToken ct)
        {
            var session = await _sessionService.GetByIdAsync(id, ct);
            if (session is null) return NotFound();
            return Ok(session);
        }

        // Useful listing (repo-based)
        [HttpGet("club/{clubId:guid}")]
        public async Task<ActionResult<List<TrainingSession>>> GetByClubAndRange(
            Guid clubId,
            [FromQuery] DateTime fromDate,
            [FromQuery] DateTime toDate,
            CancellationToken ct)
        {
            var list = await _sessionRepo.GetByClubAndDateRangeAsync(clubId, fromDate, toDate, ct);
            return Ok(list);
        }

        [HttpGet("{id:guid}/participants")]
        public async Task<ActionResult<TrainingParticipantsDto>> GetParticipants(Guid id, CancellationToken ct)
        {
            var dto = await _sessionService.GetParticipantsAsync(id, ct);
            return Ok(dto);
        }
    }
}
