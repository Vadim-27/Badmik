using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Enums.Payment;
using BadmintonApp.Domain.Payments;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Repositories
{
    public sealed class PaymentRepository : IPaymentRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public PaymentRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task<Payment?> GetByIdAsync(Guid id, CancellationToken ct)
            => _dbContext.Payments.FirstOrDefaultAsync(p => p.Id == id, ct);

        public Task<Payment?> GetPaidByBookingIdAsync(Guid bookingId, CancellationToken ct)
        {
            if (bookingId == Guid.Empty)
                throw new ArgumentException("bookingId is empty.", nameof(bookingId));

            return _dbContext.Payments
                .Where(p =>
                    p.TrainingBookingId == bookingId &&
                    p.Purpose == PaymentPurpose.TrainingBooking &&
                    p.Status == PaymentStatus.Paid)
                .OrderByDescending(p => p.PaidAtUtc ?? p.CreatedAtUtc)
                .FirstOrDefaultAsync(ct);
        }

        public async Task CreateAsync(Payment payment, CancellationToken ct)
        {
            _dbContext.Payments.Add(payment);
            await _dbContext.SaveChangesAsync(ct);
        }

        public async Task UpdateAsync(Payment payment, CancellationToken ct)
        {
            _dbContext.Payments.Update(payment);
            await _dbContext.SaveChangesAsync(ct);
        }
    }
}
