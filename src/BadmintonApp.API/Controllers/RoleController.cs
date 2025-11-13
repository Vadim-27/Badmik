using BadmintonApp.Application.DTOs.Role;
using BadmintonApp.Application.Interfaces.Roles;
using BadmintonApp.Domain.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.API.Controllers
{
    [ApiController]
    [Route("api/roles")]
    //[Authorize]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }
        [HttpPost("AssignRoleForStaff")]
        public async Task<ActionResult> AssignRoleForStaff([FromBody] AssignRoleForUserDto assignRoleForUserDto, CancellationToken cancellationToken)
        {
            await _roleService.AssignRoleForStaff(assignRoleForUserDto.UserId, assignRoleForUserDto.ClubId, assignRoleForUserDto.RoleId, cancellationToken);

            return Ok();
        }


        [HttpGet("club/{id:guid}")]
        public async Task<ActionResult> GetAllByClubId(Guid id, CancellationToken cancellationToken)
        {
            List<Role> roles = await _roleService.GetAll(id, cancellationToken);

            return Ok(roles);
        }

        [HttpPut("BindPermission")]
        public async Task<ActionResult> BindPermission([FromBody] RoleBindPermissionDto dto, CancellationToken cancellationToken)
        {
            await _roleService.RoleBindPermission(dto.RoleId, dto.PermissionId, cancellationToken);

            return Ok();
        }

        [HttpDelete("DeletePermission")]
        public async Task<ActionResult> DeletePermission([FromBody] RoleBindPermissionDto dtoDelete, CancellationToken cancellationToken)
        {
            await _roleService.RoleDeletePermission(dtoDelete.RoleId, dtoDelete.PermissionId, cancellationToken);

            return Ok();
        }

        [HttpGet("GetRolesByStaffId")]
        public async Task<ActionResult> GetRolesByStaffId(Guid staffId, Guid clubId, CancellationToken cancellationToken)
        {
            List<Role> roles = await _roleService.GetRolesByStaffId(staffId, clubId, cancellationToken);

            return Ok(roles);
        }
        


    }
}
