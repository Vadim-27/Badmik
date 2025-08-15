using System;

namespace BadmintonApp.Application.Exсeptions;

public abstract class AppException : Exception
{
    public int Code { get; }
    protected AppException(int code, string message) : base(message) => Code = code;
}
