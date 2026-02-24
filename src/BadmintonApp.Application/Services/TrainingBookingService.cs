using BadmintonApp.Application.DTOs.Trainings;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Application.Interfaces.Trainings;
using BadmintonApp.Application.Interfaces.Transactions;
using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Booking;
using BadmintonApp.Domain.Enums.Payment;
using BadmintonApp.Domain.Payments;
using BadmintonApp.Domain.Trainings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services
{
    public sealed class TrainingBookingService : ITrainingBookingService
    {
        private readonly ITransactionService _tx;
        private readonly ITrainingSessionRepository _sessions;
        private readonly ITrainingBookingRepository _bookings;
        private readonly IPaymentRepository _payments;
        private readonly IPlayerMembershipRepository _memberships;

        public TrainingBookingService(
            ITransactionService tx,
            ITrainingSessionRepository sessions,
            ITrainingBookingRepository bookings,
            IPaymentRepository payments,
            IPlayerMembershipRepository memberships)
        {
            _tx = tx;
            _sessions = sessions;
            _bookings = bookings;
            _payments = payments;
            _memberships = memberships;
        }

        public async Task<RegisterBookingResultDto> RegisterAsync(Guid sessionId, Guid playerId, Guid bookedByUserId, CancellationToken ct)
        {
            if (sessionId == Guid.Empty) throw new InvalidOperationException("sessionId is empty.");
            if (playerId == Guid.Empty) throw new InvalidOperationException("playerId is empty.");
            if (bookedByUserId == Guid.Empty) throw new InvalidOperationException("bookedByUserId is empty.");

            await _tx.Begin(ct);
            try
            {
                var session = await _sessions.GetByIdAsync(sessionId, ct) ?? throw new KeyNotFoundException("TrainingSession not found.");

                // prevent duplicates (same player)
                if (await _bookings.ExistsAsync(sessionId, playerId, ct))
                    throw new InvalidOperationException("Player is already booked (or waitlisted) for this session.");

                var registered = await _bookings.GetBySessionAsync(sessionId, ct);

                var isWaitlist = registered.Count >= session.MaxPlayers;

                var booking = new TrainingBooking
                {
                    Id = Guid.NewGuid(),
                    ClubId = session.ClubId,
                    TrainingSessionId = sessionId,
                    PlayerId = playerId,
                    BookedByUserId = bookedByUserId,

                    IsWaitlist = isWaitlist,
                    ConfirmationStatus = BookingConfirmationStatus.NotRequired, // your default
                    AttendanceStatus = AttendanceStatus.Registered,
                    CoverageStatus = CoverageStatus.None,
                    CreatedAtUtc = DateTime.UtcNow
                };

                await _bookings.CreateAsync(booking, ct);

                await _tx.Commit(ct);
                return new RegisterBookingResultDto(booking.Id, booking.IsWaitlist, booking.ConfirmationStatus);
            }
            catch
            {
                await _tx.RollBack(ct);
                throw;
            }
        }

        public async Task CancelAsync(Guid bookingId, Guid cancelledByUserId, CancellationToken ct)
        {
            if (bookingId == Guid.Empty) throw new InvalidOperationException("bookingId is empty.");
            if (cancelledByUserId == Guid.Empty) throw new InvalidOperationException("cancelledByUserId is empty.");

            await _tx.Begin(ct);
            try
            {
                var booking = await _bookings.GetByIdAsync(bookingId, ct)
                    ?? throw new KeyNotFoundException("Booking not found.");

                booking.AttendanceStatus = AttendanceStatus.Cancelled;
                booking.ConfirmationStatus = BookingConfirmationStatus.NotRequired; // or Cancelled if you have it
                booking.CoverageStatus = CoverageStatus.None;

                await _bookings.UpdateAsync(booking, ct);

                // (optional MVP) promote first waitlist to registered here
                // You can add a repository method PromoteWaitlistAsync(sessionId)

                await _tx.Commit(ct);
            }
            catch
            {
                await _tx.RollBack(ct);
                throw;
            }
        }

        public async Task ConfirmBookingAsync(Guid bookingId, Guid confirmedByUserId, CancellationToken ct)
        {
            await _tx.Begin(ct);
            try
            {
                var booking = await _bookings.GetByIdAsync(bookingId, ct)
                    ?? throw new KeyNotFoundException("Booking not found.");

                if (booking.ConfirmationStatus == BookingConfirmationStatus.NotRequired)
                {
                    await _tx.Commit(ct);
                    return;
                }

                booking.ConfirmationStatus = BookingConfirmationStatus.Confirmed;
                booking.ConfirmedAtUtc = DateTime.UtcNow;

                await _bookings.UpdateAsync(booking, ct);
                await _tx.Commit(ct);
            }
            catch
            {
                await _tx.RollBack(ct);
                throw;
            }
        }

        public async Task DeclineBookingAsync(Guid bookingId, Guid declinedByUserId, CancellationToken ct)
        {
            await _tx.Begin(ct);
            try
            {
                var booking = await _bookings.GetByIdAsync(bookingId, ct)
                    ?? throw new KeyNotFoundException("Booking not found.");

                booking.ConfirmationStatus = BookingConfirmationStatus.Declined;
                booking.AttendanceStatus = AttendanceStatus.Cancelled; // or keep Registered but declined blocks attendance
                await _bookings.UpdateAsync(booking, ct);

                await _tx.Commit(ct);
            }
            catch
            {
                await _tx.RollBack(ct);
                throw;
            }
        }

        public async Task<Guid> MarkPaidCashAsync(Guid bookingId, decimal amount, string currency, Guid createdByUserId, string? note, CancellationToken ct)
        {
            if (amount <= 0) throw new InvalidOperationException("Amount must be > 0.");
            if (string.IsNullOrWhiteSpace(currency)) throw new InvalidOperationException("Currency is required.");

            await _tx.Begin(ct);
            try
            {
                var booking = await _bookings.GetByIdAsync(bookingId, ct)
                    ?? throw new KeyNotFoundException("Booking not found.");

                // If already paid - return existing
                var existingPaid = await _payments.GetPaidByBookingIdAsync(bookingId, ct);
                if (existingPaid != null)
                {
                    await _tx.Commit(ct);
                    return existingPaid.Id;
                }

                // Do not allow money payment if membership already used (keep it strict)
                if (booking.MembershipIdUsed != null)
                    throw new InvalidOperationException("Cannot mark paid: booking is already covered by membership.");

                var payment = new Payment
                {
                    Id = Guid.NewGuid(),
                    ClubId = booking.ClubId,
                    PlayerId = booking.PlayerId,
                    Purpose = PaymentPurpose.TrainingBooking,
                    Method = PaymentMethod.Cash,
                    Status = PaymentStatus.Paid,
                    Amount = amount,
                    Currency = currency,
                    TrainingBookingId = booking.Id,
                    CreatedByUserId = createdByUserId,
                    CreatedAtUtc = DateTime.UtcNow,
                    PaidAtUtc = DateTime.UtcNow,
                    Note = note
                };

                await _payments.CreateAsync(payment, ct);

                booking.PaymentId = payment.Id;
                booking.CoverageStatus = CoverageStatus.PaidCash;
                booking.CoveredAtUtc = DateTime.UtcNow;
                booking.CoveredByUserId = createdByUserId;

                await _bookings.UpdateAsync(booking, ct);

                await _tx.Commit(ct);
                return payment.Id;
            }
            catch
            {
                await _tx.RollBack(ct);
                throw;
            }
        }

        public async Task ConfirmAttendanceAsync(Guid bookingId, Guid confirmedByUserId, CancellationToken ct)
        {
            if (bookingId == Guid.Empty) throw new InvalidOperationException("bookingId is empty.");
            if (confirmedByUserId == Guid.Empty) throw new InvalidOperationException("confirmedByUserId is empty.");

            await _tx.Begin(ct);
            try
            {
                var booking = await _bookings.GetByIdAsync(bookingId, ct)
                    ?? throw new KeyNotFoundException("Booking not found.");

                // If cancelled/declined etc. - block
                if (booking.AttendanceStatus == AttendanceStatus.Cancelled)
                    throw new InvalidOperationException("Cannot confirm attendance for cancelled booking.");

                // Mark attended (idempotent)
                booking.AttendanceStatus = AttendanceStatus.Attended;
                booking.AttendanceConfirmedAtUtc = DateTime.UtcNow;
                booking.AttendanceConfirmedByUserId = confirmedByUserId;

                // If already covered - just save attendance
                if (booking.CoverageStatus != CoverageStatus.None)
                {
                    await _bookings.UpdateAsync(booking, ct);
                    await _tx.Commit(ct);
                    return;
                }

                // 1) Money payment check (Paid only)
                var paid = await _payments.GetPaidByBookingIdAsync(booking.Id, ct);
                if (paid != null)
                {
                    booking.PaymentId = paid.Id;
                    booking.CoverageStatus = CoverageStatus.PaidCash;
                    booking.CoveredAtUtc = DateTime.UtcNow;
                    booking.CoveredByUserId = confirmedByUserId;

                    await _bookings.UpdateAsync(booking, ct);
                    await _tx.Commit(ct);
                    return;
                }

                // 2) Otherwise try membership charge
                var session = await _sessions.GetByIdAsync(booking.TrainingSessionId, ct)
                    ?? throw new KeyNotFoundException("TrainingSession not found.");

                // Your session has Date + StartTime, we need a "day" for validity checks.
                // If you store membership validity in UTC DateTime, align to your chosen convention.
                var day = session.Date.Date; // simplest: date only

                // NOTE: You probably also need SportType here; TrainingSession currently has TrainingType but no SportType.
                // I’ll use schedule.Sport later or add SportType to session.
                // For now, assume sport can be derived elsewhere or stored in session.
                var sport = SportType.Badminton; // TODO: replace with real value (store SportType in session!)
                var trainingType = session.Type;

                var membership = await _memberships.FindCoveringMembershipForUpdateAsync(
                    booking.PlayerId,
                    booking.ClubId,
                    sport,
                    trainingType,
                    day,
                    ct);

                if (membership == null || membership.TrainingsLeft <= 0)
                {
                    // Unpaid (no payment and no membership)
                    booking.CoverageStatus = CoverageStatus.None;
                    await _bookings.UpdateAsync(booking, ct);
                    await _tx.Commit(ct);
                    return;
                }

                membership.TrainingsLeft -= 1;
                await _memberships.UpdateAsync(membership, ct);

                booking.MembershipIdUsed = membership.Id;
                booking.CoverageStatus = CoverageStatus.Membership;
                booking.CoveredAtUtc = DateTime.UtcNow;
                booking.CoveredByUserId = confirmedByUserId;

                await _bookings.UpdateAsync(booking, ct);
                await _tx.Commit(ct);
            }
            catch
            {
                await _tx.RollBack(ct);
                throw;
            }
        }
    }
}
