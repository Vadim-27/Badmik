using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using Xunit;
using BadmintonApp.Api.Tests.Helpers;

namespace BadmintonApp.Api.Tests.Tests.Live
{
    public class StaffController_Tests
    {
        private static HttpClient NewAnonymousClient()
            => new() { BaseAddress = TestConfig.GetApiBaseUrl() };

        private static async Task<string> LoginAndGetTokenAsync(string email, string password)
        {
            using var http = NewAnonymousClient();
            var resp = await http.PostAsJsonAsync("/api/auth/login", new { Email = email, Password = password });
            resp.StatusCode.Should().Be(HttpStatusCode.OK, "login must succeed");

            var json = await resp.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);
            var token = doc.RootElement.GetProperty("token").GetString();
            token.Should().NotBeNullOrWhiteSpace();
            return token!;
        }

        private static HttpClient NewBearerClient(string token)
        {
            var http = NewAnonymousClient();
            http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
            return http;
        }

        [Fact(DisplayName = "STAFF: unauthorized GET => 401")]
        public async Task GetAll_Unauthorized_Returns401()
        {
            using var http = NewAnonymousClient();
            var resp = await http.GetAsync("/api/staff/GetAll");
            resp.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }

        [Fact(DisplayName = "STAFF: authorized admin GET => 200")]
        public async Task GetAll_AuthorizedAdmin_Returns200()
        {
            var (email, pwd) = TestConfig.GetAdminCreds();
            var token = await LoginAndGetTokenAsync(email, pwd);
            using var http = NewBearerClient(token);

            var resp = await http.GetAsync("/api/staff/GetAll");
            resp.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact(DisplayName = "STAFF: register new staff => 200")]
        public async Task Register_NewStaff_Returns200()
        {
            var (email, pwd) = TestConfig.GetAdminCreds();
            var token = await LoginAndGetTokenAsync(email, pwd);
            using var http = NewBearerClient(token);

            var clubId = TestConfig.GetClubId() ?? Guid.NewGuid(); // якщо клуб ще не заданий
            var suffix = Guid.NewGuid().ToString("N")[..6];

            var payload = new
            {
                Email = $"staff{suffix}@test.local",
                Password = "P@ssw0rd!",
                FirstName = "John",
                LastName = "Doe",
                PhoneNumber = "+380631234567",
                ImageUrl = "",
                ClubId = clubId,
                DoB = DateTime.UtcNow.AddYears(-30),
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

            var resp = await http.PostAsJsonAsync("/api/staff/Register", payload);
            resp.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact(DisplayName = "STAFF: GetById with random id => 404")]
        public async Task GetById_NotFound_Returns404()
        {
            var (email, pwd) = TestConfig.GetAdminCreds();
            var token = await LoginAndGetTokenAsync(email, pwd);
            using var http = NewBearerClient(token);

            var resp = await http.GetAsync($"/api/staff/{Guid.NewGuid()}/GetById");
            resp.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}