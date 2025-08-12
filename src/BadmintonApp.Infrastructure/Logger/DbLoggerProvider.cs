using BadmintonApp.Infrastructure.Persistence;
using Microsoft.Extensions.Logging;

namespace BadmintonApp.Infrastructure.Logger;

public class DbLoggerProvider : ILoggerProvider
{
    private readonly ApplicationDbContext _dbContext;

    public DbLoggerProvider(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public ILogger CreateLogger(string categoryName)
    {
        return new DbLogger(_dbContext);
    }

    public void Dispose()
    {
        
    }
}
