using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;

namespace BadmintonApp.Api.Tests.Helpers;

public static class AuthClient
{
    public static async Task<string> LoginAndGetTokenAsync(HttpClient client, string email, string password)
    {
        var payload = new { Email = email, Password = password };
        var resp = await client.PostAsJsonAsync("/api/auth/login", payload);
        resp.EnsureSuccessStatusCode();
        var json = await resp.Content.ReadAsStringAsync();

        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        root.TryGetProperty("token", out var tokenProp).Should().BeTrue("Login response should contain 'token'.");
        var token = tokenProp.GetString();
        token.Should().NotBeNullOrWhiteSpace();

        return token!;
    }

    public static void UseBearer(this HttpClient client, string token)
    {
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }
}