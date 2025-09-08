using System;

namespace BadmintonApp.Application.Exceptions;

public abstract class AppException : Exception
{
    public int Code { get; }
    protected AppException(int code, string message) : base(message) => Code = code;
}
