using BadmintonApp.Application.Interfaces.Transactions;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Repositories
{
    internal class TransactionService : ITransactionService
    {
        private readonly ApplicationDbContext _dbContext;

        private IDbContextTransaction _transaction;
        public TransactionService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task Begin(CancellationToken cancellationToken)
        {
            _transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);
        }

        public async Task Commit(CancellationToken cancellationToken)
        {
            await _transaction.CommitAsync(cancellationToken);
        }

        public async Task RollBack(CancellationToken cancellationToken)
        {
            await _transaction.RollbackAsync(cancellationToken);
        }
    }
}
