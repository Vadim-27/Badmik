
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using BadmintonApp.Api.Tests.Fixtures;
using BadmintonApp.Api.Tests.Helpers;
using FluentAssertions;
using Xunit;

namespace BadmintonApp.Api.Tests.Tests.Auth;

public class AuthController_Login_Tests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public AuthController_Login_Tests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact(DisplayName = "POST /api/auth/login returns 200 and token on valid credentials")]
    public async Task Login_ReturnsToken_OnValidCredentials()
    {
        var client = _factory.CreateClientWithBasePath();

        var payload = new
        {
            
            Email = "admin@badminton.ua",
            Password = "admin123"
        };

        var resp = await client.PostAsJsonAsync("/api/auth/login", payload);
        resp.StatusCode.Should().Be(HttpStatusCode.OK);

        var json = await resp.Content.ReadAsStringAsync();
        using var doc = JsonAssert.Parse(json);
        var root = doc.RootElement;

        // Очікуємо поля у відповіді (замініть під ваш контракт)
        JsonAssert.HasProperty(root, "token");
        var token = JsonAssert.GetString(root, "token");
        token.Should().NotBeNullOrWhiteSpace();
    }

    [Fact(DisplayName = "POST /api/auth/login returns 400 on invalid payload")]
    public async Task Login_ReturnsBadRequest_OnInvalidPayload()
    {
        var client = _factory.CreateClientWithBasePath();

        var payload = new
        {
            //no credentials
        };

        var resp = await client.PostAsJsonAsync("/api/auth/login", payload);
        resp.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact(DisplayName = "POST /api/auth/login returns 401 on wrong credentials")]
    public async Task Login_ReturnsUnauthorized_OnWrongCreds()
    {
        var client = _factory.CreateClientWithBasePath();

        var payload = new
        {
            Email = "unknown@test.local",
            Password = "wrong"
        };

        var resp = await client.PostAsJsonAsync("/api/auth/login", payload);
        resp.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
