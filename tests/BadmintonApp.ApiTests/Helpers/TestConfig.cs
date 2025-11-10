using Microsoft.Extensions.Configuration;

namespace BadmintonApp.Api.Tests.Helpers;

public static class TestConfig
{
        private static readonly Lazy<IConfigurationRoot> _config = new(() =>
        {
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.Test.json", optional: true, reloadOnChange: false)
                .AddEnvironmentVariables(); 
            return builder.Build();
        });

        public static IConfigurationRoot Value => _config.Value;

        public static (string Email, string Password) GetAdminCreds()
        {
            var email = Environment.GetEnvironmentVariable("TEST_ADMIN_EMAIL")
                        ?? Value["TestUsers:Admin:Email"]
                        ?? "admin@test.local";
            var pwd = Environment.GetEnvironmentVariable("TEST_ADMIN_PASSWORD")
                        ?? Value["TestUsers:Admin:Password"]
                        ?? "P@ssw0rd!";
            return (email, pwd);
        }

        public static (string Email, string Password) GetUserCreds()
        {
            var email = Environment.GetEnvironmentVariable("TEST_USER_EMAIL")
                        ?? Value["TestUsers:User:Email"]
                        ?? "user@test.local";
            var pwd = Environment.GetEnvironmentVariable("TEST_USER_PASSWORD")
                        ?? Value["TestUsers:User:Password"]
                        ?? "P@ssw0rd!";
            return (email, pwd);
        }


        public static Uri? GetApiBaseUrl()
        {
            var fromEnv = Environment.GetEnvironmentVariable("TEST_API_BASEURL");
            var fromCfg = Value["Api:BaseUrl"];
            var raw = fromEnv ?? fromCfg;

            if (string.IsNullOrWhiteSpace(raw)) return null;
            return Uri.TryCreate(raw, UriKind.Absolute, out var uri) ? uri : null;
        }

    public static Guid? GetClubId()
    {
        var raw = Environment.GetEnvironmentVariable("TEST_CLUB_ID") ?? Value["TestData:ClubId"];
        if (string.IsNullOrWhiteSpace(raw)) return null;
        return Guid.TryParse(raw, out var g) ? g : null;
    }
}