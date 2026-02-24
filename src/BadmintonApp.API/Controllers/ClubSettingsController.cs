using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Application.Interfaces.Clubs;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.API.Controllers
{
    [ApiController]
    [Route("api/clubs/{clubId:guid}/settings")]
    public sealed class ClubSettingsController : ControllerBase
    {
        private readonly IClubSettingsService _service;

        public ClubSettingsController(IClubSettingsService service)
        {
            _service = service;
        }

        [HttpGet]
        public Task<ClubSettingsDto> Get(Guid clubId, CancellationToken ct)
            => _service.GetAsync(clubId, ct);

        [HttpPut]
        public Task<ClubSettingsDto> Update(Guid clubId, [FromBody] ClubSettingsDto dto, CancellationToken ct)
            => _service.UpdateAsync(clubId, dto, ct);
    }
}
