using BadmintonApp.Application.DTOs.Booking;
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
    [Route("api/training-bookings")]
    public class TrainingBookingsController : ControllerBase
    {
        private readonly ITrainingBookingService _bookingService;
        private readonly ITrainingBookingRepository _bookingRepo;
        private readonly ICurrentUserContext _current;


        public TrainingBookingsController(
            ITrainingBookingService bookingService,
            ITrainingBookingRepository bookingRepo,
            ICurrentUserContext current)
        {
            _bookingService = bookingService;
            _bookingRepo = bookingRepo;
            _current = current;
        }

        // -------- Reads --------

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<TrainingBooking>> GetById(Guid id, CancellationToken ct)
        {
            var booking = await _bookingRepo.GetByIdAsync(id, ct);
            if (booking is null) return NotFound();
            return Ok(booking);
        }

        [HttpGet("session/{sessionId:guid}")]
        public async Task<ActionResult<List<TrainingBooking>>> GetBySession(Guid sessionId, CancellationToken ct)
        {
            var list = await _bookingRepo.GetBySessionAsync(sessionId, ct);
            return Ok(list);
        }

        // -------- Commands --------

        /// <summary>Register player for a session (service decides Registered vs Waitlist).</summary>
        [HttpPost("register")]
        public async Task<ActionResult<RegisterBookingResultDto>> Register([FromBody] CreateBookingDto dto, CancellationToken ct)
        {
            // Expect dto contains: SessionId, PlayerId, BookedByUserId (names may differ)
            var result = await _bookingService.RegisterAsync(dto.TrainingSessionId, dto.PlayerId, _current.UserId, ct);
            return Ok(result);
        }

        [HttpPost("{bookingId:guid}/cancel")]
        public async Task<IActionResult> Cancel(Guid bookingId, CancellationToken ct)
        {
            await _bookingService.CancelAsync(bookingId, _current.UserId, ct);
            return NoContent();
        }

        [HttpPost("{bookingId:guid}/confirm")]
        public async Task<IActionResult> Confirm(Guid bookingId, CancellationToken ct)
        {
            await _bookingService.ConfirmBookingAsync(bookingId, _current.UserId, ct);
            return NoContent();
        }

        [HttpPost("{bookingId:guid}/decline")]
        public async Task<IActionResult> Decline(Guid bookingId, CancellationToken ct)
        {
            await _bookingService.DeclineBookingAsync(bookingId, _current.UserId, ct);
            return NoContent();
        }

        /// <summary>
        /// Confirms attendance (Attended) and auto-covers (Paid cash/online if exists; else tries membership; else Unpaid).
        /// </summary>
        [HttpPost("{bookingId:guid}/confirm-attendance")]
        public async Task<IActionResult> ConfirmAttendance(Guid bookingId, CancellationToken ct)
        {
            await _bookingService.ConfirmAttendanceAsync(bookingId, _current.UserId, ct);
            return NoContent();
        }

        /// <summary>Manager marks cash payment for this booking.</summary>
        [HttpPost("{bookingId:guid}/paid-cash")]
        public async Task<ActionResult<Guid>> PaidCash(Guid bookingId, [FromBody] CoverByCashDto dto, CancellationToken ct)
        {
            // Expect dto contains: Amount, Currency, CreatedByUserId, Note
            var paymentId = await _bookingService.MarkPaidCashAsync(
                bookingId,
                dto.Amount,
                dto.Currency,
                _current.UserId,
                dto.Note,
                ct);

            return Ok(paymentId);
        }
    }
}
