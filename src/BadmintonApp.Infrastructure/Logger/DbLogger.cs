using BadmintonApp.Infrastructure.Persistence;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;

namespace BadmintonApp.Infrastructure.Logger;

public class DbLogger : ILogger
{
    private readonly ApplicationDbContext _dbContext;

    public DbLogger(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public IDisposable BeginScope<TState>(TState state) where TState : notnull
    {
        return null;
    }

    public bool IsEnabled(LogLevel logLevel)
    {
        return true;
    }

    public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
    {
        if (IsEnabled(logLevel) == false)
        {
            return;
        }

        Domain.Logs.Log log = new Domain.Logs.Log
        {
            Id = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            Level = logLevel,
            Message = formatter(state, exception),
            ExceptionJson = JsonConvert.SerializeObject(exception)
        };

        _dbContext.Logs.Add(log);

        _dbContext.SaveChanges();
    }
}
