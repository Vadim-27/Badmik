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

        private static object BuildWorkingHours()
        {
            // 24h format strings, e.g. "09:00" .. "18:00"
            return new
            {
                Monday = new { From = "09:00", To = "18:00" },
                Tuesday = new { From = "09:00", To = "18:00" },
                Wednesday = new { From = "09:00", To = "18:00" },
                Thursday = new { From = "09:00", To = "18:00" },
                Friday = new { From = "09:00", To = "18:00" },
                Saturday = new { From = "10:00", To = "14:00" },
                Sunday = new { From = "00:00", To = "00:00" } // treat as closed
            };
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

        [Fact(DisplayName = "STAFF: after Register it appears in GetAll and can be fetched by GetById")]
        public async Task Register_Then_GetAll_And_GetById()
        {
            // 1) login as admin
            var (email, pwd) = TestConfig.GetAdminCreds();
            var token = await LoginAndGetTokenAsync(email, pwd);
            using var http = NewBearerClient(token);

            // 2) need a valid ClubId to create staff
            var clubId = TestConfig.GetClubId();
            if (clubId is null)
            {
                // якщо ClubId не заданий — пропускаємо, щоб не отримати 400 від бекенду
                return;
            }

            // 3) create a unique staff
            var suffix = Guid.NewGuid().ToString("N")[..6];
            var newEmail = $"staff{suffix}@test.local";

            var payload = new
            {
                Email = newEmail,
                Password = "P@ssw0rd!",
                FirstName = "FindMe",
                LastName = $"Staff{suffix}",
                PhoneNumber = "+380631234567",
                ImageUrl = "",
                ClubId = clubId.Value,
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
                WorkingHours = BuildWorkingHours()
            };

            var registerResp = await http.PostAsJsonAsync("/api/staff/Register", payload);
            registerResp.StatusCode.Should().Be(HttpStatusCode.OK);

            // 4) fetch GetAll (зробимо більший pageSize на випадок пагінації)
            var listResp = await http.GetAsync("/api/staff/GetAll?PageNumber=1&PageSize=200");
            listResp.StatusCode.Should().Be(HttpStatusCode.OK);

            var listJson = await listResp.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(listJson);

            // GetAll може повернути або масив, або об’єкт з "items"
            JsonElement itemsNode = doc.RootElement;
            if (doc.RootElement.ValueKind == JsonValueKind.Object && doc.RootElement.TryGetProperty("items", out var itemsProp))
                itemsNode = itemsProp;

            itemsNode.ValueKind.Should().BeOneOf(JsonValueKind.Array);

            // 5) знайти створеного за Email та взяти Id
            Guid? foundId = null;
            foreach (var el in itemsNode.EnumerateArray())
            {
                if (el.ValueKind != JsonValueKind.Object) continue;
                if (el.TryGetProperty("email", out var emailProp) && string.Equals(emailProp.GetString(), newEmail, StringComparison.OrdinalIgnoreCase))
                {
                    if (el.TryGetProperty("id", out var idProp) && Guid.TryParse(idProp.GetString(), out var id))
                        foundId = id;
                    break;
                }
                // іноді поля можуть бути "Email"/"Id" з великої
                if (el.TryGetProperty("Email", out var emailProp2) && string.Equals(emailProp2.GetString(), newEmail, StringComparison.OrdinalIgnoreCase))
                {
                    if (el.TryGetProperty("Id", out var idProp2))
                    {
                        if (idProp2.ValueKind == JsonValueKind.String && Guid.TryParse(idProp2.GetString(), out var id2))
                            foundId = id2;
                        else if (idProp2.ValueKind == JsonValueKind.Number && idProp2.TryGetGuid(out var id3))
                            foundId = id3;
                    }
                    break;
                }
            }

            foundId.Should().NotBeNull("created staff must appear in GetAll");

            // 6) перевірити GetById і співпадіння email
            var byIdResp = await http.GetAsync($"/api/staff/{foundId!.Value}/GetById");
            byIdResp.StatusCode.Should().Be(HttpStatusCode.OK);

            var byIdJson = await byIdResp.Content.ReadAsStringAsync();
            using var byIdDoc = JsonDocument.Parse(byIdJson);

            // Підтвердимо email (враховуємо варіації регістру ключів)
            bool emailMatches =
                (byIdDoc.RootElement.TryGetProperty("email", out var e1) && string.Equals(e1.GetString(), newEmail, StringComparison.OrdinalIgnoreCase)) ||
                (byIdDoc.RootElement.TryGetProperty("Email", out var e2) && string.Equals(e2.GetString(), newEmail, StringComparison.OrdinalIgnoreCase));

            emailMatches.Should().BeTrue("GetById should return the staff we just created");
        }
    }
}