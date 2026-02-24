using BadmintonApp.Application.DTOs.Clubs;
using BadmintonApp.Application.Interfaces.Clubs;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.API.Controllers
{
    [ApiController]
    [Route("api/clubs/{clubId:guid}/membership-plans")]
    public class ClubMembershipPlansController : ControllerBase
    {
        private readonly IClubMembershipPlanService _service;

        public ClubMembershipPlansController(IClubMembershipPlanService service)
        {
            _service = service;
        }

        [HttpGet]
        public Task<List<ClubMembershipPlanDto>> GetAll(Guid clubId, CancellationToken ct)
            => _service.GetByClub(clubId, ct);

        [HttpGet("{planId:guid}")]
        public Task<ClubMembershipPlanDto> GetById(Guid clubId, Guid planId, CancellationToken ct)
            => _service.GetById(clubId, planId, ct);

        [HttpPost]
        public Task<ClubMembershipPlanDto> Create(Guid clubId, [FromBody] CreateClubMembershipPlanDto dto, CancellationToken ct)
            => _service.Create(clubId, dto, ct);

        [HttpPut("{planId:guid}")]
        public Task<ClubMembershipPlanDto> Update(Guid clubId, Guid planId, [FromBody] UpdateClubMembershipPlanDto dto, CancellationToken ct)
            => _service.Update(clubId, planId, dto, ct);

        [HttpDelete("{planId:guid}")]
        public Task Delete(Guid clubId, Guid planId, CancellationToken ct)
            => _service.Delete(clubId, planId, ct);
    }
}
