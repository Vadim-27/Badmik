using BadmintonApp.Domain.Core;
using System;
using System.Security.Claims;

namespace BadmintonApp.API.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal claimsPrincipal)
    {
        return new Guid (claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier));
    }
}
