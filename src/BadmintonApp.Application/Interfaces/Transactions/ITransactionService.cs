using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Transactions;

public interface ITransactionService
{
    Task Begin(CancellationToken cancellationToken);
    Task Commit(CancellationToken cancellationToken);
    Task RollBack(CancellationToken cancellationToken);
}
