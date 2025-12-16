
using System.Text.Json;
using FluentAssertions;

namespace BadmintonApp.Api.Tests.Helpers;

public static class JsonAssert
{
    public static JsonDocument Parse(string json)
    {
        return JsonDocument.Parse(json);
    }

    public static void HasProperty(JsonElement element, string name)
    {
        element.TryGetProperty(name, out _).Should().BeTrue($"JSON must contain '{name}'");
    }

    public static string? GetString(JsonElement element, string name)
    {
        element.TryGetProperty(name, out var val).Should().BeTrue($"JSON must contain '{name}'");
        return val.GetString();
    }
}
