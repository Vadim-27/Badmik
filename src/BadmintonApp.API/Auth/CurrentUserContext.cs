using BadmintonApp.API.Extensions;
using BadmintonApp.Application.Interfaces.Auth;
using Microsoft.AspNetCore.Http;
using System;

namespace BadmintonApp.API.Auth
{
    public class CurrentUserContext : ICurrentUserContext
    {
        private readonly IHttpContextAccessor _http;

        public CurrentUserContext(IHttpContextAccessor http)
        {
            _http = http;
        }

        public bool IsAuthenticated =>
            _http.HttpContext?.User?.Identity?.IsAuthenticated == true;

        public Guid UserId =>
            _http.HttpContext?.User.GetUserId()
            ?? throw new UnauthorizedAccessException("Missing userId claim.");

        public Guid ClubId =>
            _http.HttpContext?.User.GetClubId()
            ?? throw new UnauthorizedAccessException("Missing clubId claim.");
    }
}
