using BadmintonApp.Domain.Payments;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories
{
    public interface IPaymentRepository
    {
        Task<Payment?> GetByIdAsync(Guid id, CancellationToken ct);
        Task CreateAsync(Payment payment, CancellationToken ct);
        Task UpdateAsync(Payment payment, CancellationToken ct);
        Task<Payment?> GetPaidByBookingIdAsync(Guid bookingId, CancellationToken ct);
    }
}
