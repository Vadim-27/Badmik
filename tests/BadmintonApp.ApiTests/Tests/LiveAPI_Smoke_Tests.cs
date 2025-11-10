using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using BadmintonApp.Api.Tests.Helpers;
using FluentAssertions;
using Xunit;

namespace BadmintonApp.Api.Tests.Tests.Live;

public class LiveApi_Smoke_Tests
{
    private static HttpClient NewAnonymousClient()
        => new() { BaseAddress = TestConfig.GetApiBaseUrl() };

    private static async Task<string> LoginAndGetTokenAsync(string email, string password)
    {
        using var http = NewAnonymousClient();
        var payload = new { Email = email, Password = password };

        var resp = await http.PostAsJsonAsync("/api/auth/login", payload);
        resp.StatusCode.Should().Be(HttpStatusCode.OK, $"login should return 200 for {email}");
        var json = await resp.Content.ReadAsStringAsync();

        using var doc = JsonDocument.Parse(json);
        doc.RootElement.TryGetProperty("token", out var tokenProp).Should().BeTrue("login response must contain 'token'");
        var token = tokenProp.GetString();
        token.Should().NotBeNullOrWhiteSpace();
        return token!;
    }

    private static HttpClient NewBearerClient(string token)
    {
        var http = NewAnonymousClient();
        http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return http;
    }

    [Fact(DisplayName = "LOGIN: admin returns JWT token")]
    public async Task Login_Admin_Returns_Token()
    {
        var (email, pwd) = TestConfig.GetAdminCreds();
        var token = await LoginAndGetTokenAsync(email, pwd);
        token.Should().NotBeNullOrWhiteSpace();
    }

    [Fact(DisplayName = "LOGIN: user returns JWT token")]
    public async Task Login_User_Returns_Token()
    {
        var (email, pwd) = TestConfig.GetUserCreds();
        var token = await LoginAndGetTokenAsync(email, pwd);
        token.Should().NotBeNullOrWhiteSpace();
    }

    [Fact(DisplayName = "STAFF: GET without token => 401")]
    public async Task Staff_List_Unauthorized()
    {
        using var http = NewAnonymousClient();
        var resp = await http.GetAsync("/api/staff");
        resp.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact(DisplayName = "STAFF: GET as regular user => 403")]
    public async Task Staff_List_Forbidden_For_User()
    {
        var (email, pwd) = TestConfig.GetUserCreds();
        var userToken = await LoginAndGetTokenAsync(email, pwd);
        using var http = NewBearerClient(userToken);
        var resp = await http.GetAsync("/api/staff");
        resp.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact(DisplayName = "STAFF: GET as admin => 200 and returns array")]
    public async Task Staff_List_Ok_For_Admin()
    {
        var (email, pwd) = TestConfig.GetAdminCreds();
        var adminToken = await LoginAndGetTokenAsync(email, pwd);
        using var http = NewBearerClient(adminToken);

        var resp = await http.GetAsync("/api/staff");
        resp.StatusCode.Should().Be(HttpStatusCode.OK);

        // Список може бути порожнім — головне, щоб JSON масив
        var json = await resp.Content.ReadAsStringAsync();
        json.TrimStart().First().Should().Be('[');
    }

    [Fact(DisplayName = "STAFF: POST create by admin => 201 (requires valid ClubId)")]
    public async Task Staff_Create_Ok_For_Admin_When_Club_Configured()
    {
        var clubId = TestConfig.GetClubId();
        if (clubId is null)
        {
            // Якщо немає ClubId — пропускаємо тільки цей тест
            return;
        }

        var (email, pwd) = TestConfig.GetAdminCreds();
        var adminToken = await LoginAndGetTokenAsync(email, pwd);
        using var http = NewBearerClient(adminToken);

        // payload під StaffRegisterDto
        var suffix = Guid.NewGuid().ToString("N")[..6];
        var payload = new
        {
            Email = $"staff.{suffix}@badmik.local",
            Password = "P@ssw0rd!",
            FirstName = "Test",
            LastName = $"Staff{suffix}",
            PhoneNumber = "+380631112233",
            ImageUrl = "",
            ClubId = clubId.Value,
            DoB = "1990-01-01T00:00:00Z",
            StaffStatus = 0,
            EmploymentType = 0,
            Title = "Coach",
            StartDate = DateTime.UtcNow.ToString("yyyy-MM-dd"), // для DateOnly
            Notes = "",
            SalaryType = 0,
            HourlyRate = 0,
            MonthlySalary = 0,
            Currency = "UAH",
            PerTrainingRate = 0,
            PayrollNotes = "",
            TimeZone = "Europe/Kyiv",
            WorkingHours = new { } // мінімальний валідний об'єкт
        };

        var resp = await http.PostAsJsonAsync("/api/staff", payload);
        resp.StatusCode.Should().Be(HttpStatusCode.Created);
        resp.Headers.Location.Should().NotBeNull();

        // перевіримо що GET по Location дає 200
        var get = await http.GetAsync(resp.Headers.Location);
        get.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact(DisplayName = "STAFF: POST create with empty ClubId => 400")]
    public async Task Staff_Create_BadRequest_Empty_Club()
    {
        var (email, pwd) = TestConfig.GetAdminCreds();
        var adminToken = await LoginAndGetTokenAsync(email, pwd);
        using var http = NewBearerClient(adminToken);

        var payload = new
        {
            Email = $"staff.badclub@badmik.local",
            Password = "P@ssw0rd!",
            FirstName = "NoClub",
            LastName = "Staff",
            PhoneNumber = "+380631112233",
            ImageUrl = "",
            ClubId = Guid.Empty,
            DoB = "1990-01-01T00:00:00Z",
            StaffStatus = 0,
            EmploymentType = 0,
            Title = "Coach",
            StartDate = DateTime.UtcNow.ToString("yyyy-MM-dd"),
            Notes = "",
            SalaryType = 0,
            HourlyRate = 0,
            MonthlySalary = 0,
            Currency = "UAH",
            PerTrainingRate = 0,
            PayrollNotes = "",
            TimeZone = "Europe/Kyiv",
            WorkingHours = new { }
        };

        var resp = await http.PostAsJsonAsync("/api/staff", payload);
        resp.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}