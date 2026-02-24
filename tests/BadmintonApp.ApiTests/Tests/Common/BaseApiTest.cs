using BadmintonApp.Api.Tests.Fixtures;
using BadmintonApp.Api.Tests.Helpers;
using Xunit;

namespace BadmintonApp.Api.Tests.Tests.Common;

public abstract class BaseApiTest : IClassFixture<CustomWebApplicationFactory>, IAsyncLifetime
{
    protected readonly CustomWebApplicationFactory Factory;
    protected HttpClient AnonymousClient = null!;
    protected HttpClient AdminClient = null!;
    protected HttpClient UserClient = null!;

    protected BaseApiTest(CustomWebApplicationFactory factory)
    {
        Factory = factory;
    }

    public virtual async Task InitializeAsync()
    {
        var external = TestConfig.GetApiBaseUrl();

        // Anonymous
        AnonymousClient = external is null
            ? Factory.CreateClientWithBasePath()
            : new HttpClient { BaseAddress = external };

        // Admin
        AdminClient = external is null
            ? Factory.CreateClientWithBasePath()
            : new HttpClient { BaseAddress = external };

        var (adminEmail, adminPwd) = TestConfig.GetAdminCreds();
        var adminKey = $"admin:{adminEmail}";
        if (!TokenCache.TryGet(adminKey, out var adminToken))
        {
            adminToken = await AuthClient.LoginAndGetTokenAsync(AdminClient, adminEmail, adminPwd);
            TokenCache.Set(adminKey, adminToken);
        }
        AdminClient.WithBearer(adminToken);

        // User
        UserClient = external is null
            ? Factory.CreateClientWithBasePath()
            : new HttpClient { BaseAddress = external };

        var (userEmail, userPwd) = TestConfig.GetUserCreds();
        var userKey = $"user:{userEmail}";
        if (!TokenCache.TryGet(userKey, out var userToken))
        {
            userToken = await AuthClient.LoginAndGetTokenAsync(UserClient, userEmail, userPwd);
            TokenCache.Set(userKey, userToken);
        }
        UserClient.WithBearer(userToken);
    }

    public virtual Task DisposeAsync() => Task.CompletedTask;

    protected async Task<HttpClient> CreateBearerClientAsync(string email, string password)
    {
        var external = TestConfig.GetApiBaseUrl();

        var client = external is null
            ? Factory.CreateClientWithBasePath()
            : new HttpClient { BaseAddress = external };

        var cacheKey = $"token:{email}";
        if (!TokenCache.TryGet(cacheKey, out var token))
        {
            token = await AuthClient.LoginAndGetTokenAsync(client, email, password);
            TokenCache.Set(cacheKey, token);
        }

        client.WithBearer(token);
        return client;
    }

    protected Task<HttpClient> CreateOtherClubAdminClientAsync()
    {
        var (email, pwd) = TestConfig.GetClub1AdminCreds(); 
        return CreateBearerClientAsync(email, pwd);
    }


}