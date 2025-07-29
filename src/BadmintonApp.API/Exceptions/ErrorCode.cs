namespace BadmintonApp.API.Exceptions
{
    public enum ErrorCode
    {
        NotFound = 1,
        ValidationFailed = 2,
        AccessDenied = 3,
        InternalError = 4,
        EmailAlreadyUsed = 5,
        Conflict = 6,
        TokenExpired = 7,
        AlreadyExists = 8,
        MissingRequiredField = 9,
        TrainingLevelMismatch = 10
    }
}
