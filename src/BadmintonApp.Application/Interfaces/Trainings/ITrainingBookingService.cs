using BadmintonApp.Application.DTOs.Trainings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Trainings
{
    public interface ITrainingBookingService
    {
        Task<RegisterBookingResultDto> RegisterAsync(Guid sessionId, Guid playerId, Guid bookedByUserId, CancellationToken ct);
        Task CancelAsync(Guid bookingId, Guid cancelledByUserId, CancellationToken ct);

        // Optional: if confirmation needed
        Task ConfirmBookingAsync(Guid bookingId, Guid confirmedByUserId, CancellationToken ct);
        Task DeclineBookingAsync(Guid bookingId, Guid declinedByUserId, CancellationToken ct);

        // The key method we discussed
        Task ConfirmAttendanceAsync(Guid bookingId, Guid confirmedByUserId, CancellationToken ct);

        // When manager clicks "Paid cash" for this booking
        Task<Guid> MarkPaidCashAsync(Guid bookingId, decimal amount, string currency, Guid createdByUserId, string? note, CancellationToken ct);
    }
}
