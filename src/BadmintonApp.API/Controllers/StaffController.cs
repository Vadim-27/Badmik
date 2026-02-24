using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Media;
using BadmintonApp.Application.DTOs.Paginations;
using BadmintonApp.Application.DTOs.Staff;
using BadmintonApp.Application.Interfaces.Media;
using BadmintonApp.Application.Interfaces.Staffs;
using BadmintonApp.Application.Interfaces.Users;
using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Media;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.API.Controllers
{
    [ApiController]
    [Route("api/staffs")]
    public class StaffController : ControllerBase
    {
        private readonly IUsersService _usersService;
        private readonly IStaffService _staffService;
        private readonly IMediaService _media;

        public StaffController(IUsersService usersService, IStaffService staffService, IMediaService media)
        {
            _usersService = usersService;
            _staffService = staffService;
        }

        [HttpPost("")]
        public async Task<ActionResult> Register([FromBody] StaffRegisterDto dto, CancellationToken cancellationToken)
        {
            await _staffService.RegisterStaffAsync(dto, cancellationToken);
            return Ok();
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult> Update([FromBody] StaffUpdateDto dto, CancellationToken cancellationToken)
        {
            await _staffService.Update(dto, cancellationToken);
            return Ok();
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            StaffDto staff = await _staffService.GetById(id, cancellationToken);
            if (staff == null)
                return NotFound();
            return Ok(staff);
        }

        [HttpGet("user/{id:guid}")]
        public async Task<ActionResult> GetByUserId(Guid id, CancellationToken cancellationToken)
        {
            StaffDto staff = await _staffService.GetByUserId(id, cancellationToken);
            if (staff == null)
                return NotFound();
            return Ok(staff);
        }

        [HttpGet("")]
        public async Task<ActionResult> GetAll([FromQuery]ClubPaginationFilterDto paginationFilterDto, CancellationToken cancellationToken)
        {
            var result = await _staffService.GetAll(paginationFilterDto, cancellationToken);
            return Ok(result);
        }

        [HttpPut("ChangePassword")]
        public async Task<ActionResult> ChangePassword([FromBody] StaffUpdatePasswordDto staffUpdateDto, CancellationToken cancellationToken)
        {
            await _staffService.ChangePassword(staffUpdateDto, cancellationToken);
            return Ok();
        }

        [HttpPut("{id:guid}/photo")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<MediaItemDto>> UploadPhoto(Guid id, IFormFile file, CancellationToken ct)
        {
            if (file == null || file.Length == 0) return BadRequest("File is required.");
            var player = await _staffService.GetById(id, ct);
            if (player == null)
            {
                return NotFound("Player not found.");
            }

            var result = await _media.UploadSingleAsync(EntityType.Player, id, MediaKind.Avatar, file, ct);

            return Ok(result);
        }

        [HttpDelete("{id:guid}/photo")]
        public async Task<IActionResult> DeletePhoto(Guid id, CancellationToken ct)
        {
            await _media.DeleteSingleAsync(EntityType.Player, id, MediaKind.Avatar, ct);
            return NoContent();
        }

        [HttpGet("{id:guid}/logo")]
        public async Task<ActionResult<MediaItemDto?>> GetPhoto(Guid id, CancellationToken ct)
        {
            var items = await _media.GetAsync(EntityType.Location, id, MediaKind.Logo, ct);
            return Ok(items.FirstOrDefault());
        }

    }
}
