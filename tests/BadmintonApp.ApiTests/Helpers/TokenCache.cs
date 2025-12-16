using System.Collections.Concurrent;

namespace BadmintonApp.Api.Tests.Helpers;

public static class TokenCache
{
    private static readonly ConcurrentDictionary<string, string> _tokens = new();

    public static bool TryGet(string key, out string token) => _tokens.TryGetValue(key, out token!);

    public static void Set(string key, string token) => _tokens[key] = token;
}