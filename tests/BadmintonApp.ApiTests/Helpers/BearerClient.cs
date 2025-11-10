using System.Net.Http.Headers;

namespace BadmintonApp.Api.Tests.Helpers;

public static class BearerClient
{
    public static HttpClient WithBearer(this HttpClient client, string token)
    {
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return client;
    }
}