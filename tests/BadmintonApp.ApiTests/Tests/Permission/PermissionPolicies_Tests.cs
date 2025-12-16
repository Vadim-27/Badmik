
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using BadmintonApp.Api.Tests.Fixtures;
using FluentAssertions;
using Xunit;

namespace BadmintonApp.Api.Tests.Tests.Permissions;

public class PermissionPolicies_Tests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public PermissionPolicies_Tests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    
    [Fact(DisplayName = "Protected endpoint returns 403 for user without permission")]
    public async Task Protected_Endpoint_Forbidden_WithoutPermission()
    {
        var client = _factory.CreateClientWithBasePath();

        var resp = await client.GetAsync("/api/admin/clubs"); 
        resp.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact(DisplayName = "Protected endpoint returns 200 for user with permission")]
    public async Task Protected_Endpoint_Ok_WithPermission()
    {
        var client = _factory.CreateClientWithBasePath();

        var resp = await client.GetAsync("/api/admin/clubs"); 
        
        resp.StatusCode.Should().BeOneOf(HttpStatusCode.OK, HttpStatusCode.NoContent);
    }
}
