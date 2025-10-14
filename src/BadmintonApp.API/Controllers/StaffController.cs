using BadmintonApp.Application.DTOs.Staff;
using BadmintonApp.Application.Interfaces.Staffs;
using BadmintonApp.Application.Interfaces.Users;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.API.Controllers
{
    [ApiController]
    [Route("api/staff")]
    public class StaffController : ControllerBase
    {
        private readonly IUsersService _usersService;
        private readonly IStaffService _staffService;

        public StaffController(IUsersService usersService, IStaffService staffService)
        {
            _usersService = usersService;
            _staffService = staffService;
        }

        [HttpPost("Register")]
        public async Task<ActionResult> Register([FromBody] StaffRegisterDto dto, CancellationToken cancellationToken)
        {
            await _usersService.RegisterStaffAsync(dto, cancellationToken);
            return Ok();
        }

        [HttpPut("Update")]
        public async Task<ActionResult> Update([FromBody] StaffUpdateDto dto, CancellationToken cancellationToken)
        {
            await _staffService.Update(dto, cancellationToken);
            return Ok();
        }

        [HttpGet("{id}/GetById")]
        public async Task<ActionResult> GetById(Guid id, CancellationToken cancellationToken)
        {
            StaffDto staff = await _staffService.GetById(id, cancellationToken);
            if (staff == null)
                return NotFound();
            return Ok(staff);
        }

        [HttpGet("GetAll")]
        public async Task<ActionResult> GetAll(CancellationToken cancellationToken)
        {
            List<StaffDto> staffDtos = await _staffService.GetAll(cancellationToken);

            return Ok(staffDtos);
        }

    }
}
