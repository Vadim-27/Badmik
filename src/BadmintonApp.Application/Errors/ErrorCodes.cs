namespace BadmintonApp.Application.Errors;

public class ErrorCodes
{
    public static class Training
    {
        public const string NotFound = "Training.NotFound";
        public const string Full = "Training.Full";
    }

    public static class Common
    {
        public const string Validation = "Common.Validation";
        public const string Forbidden = "Common.Forbidden";
        public const string Conflict = "Common.Conflict";
        public const string ServerError = "Server.Error";
        public const string Concurrency = "Concurrency.Conflict";
    }
}
