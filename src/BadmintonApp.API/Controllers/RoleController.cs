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
    [Route("api/role")]
    //[Authorize]
    public class RoleController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }
        [HttpPost("AssignRoleForUser")]
        public async Task<ActionResult> AssignRoleForUser([FromBody] AssignRoleForUserDto assignRoleForUserDto, CancellationToken cancellationToken)
        {
            await _roleService.AssignRoleForUser(assignRoleForUserDto.UserId, assignRoleForUserDto.ClubId, assignRoleForUserDto.RoleId, cancellationToken);

            return Ok();
        }

        [HttpGet("GetAll")]
        public async Task<ActionResult> GetAll(Guid clubId, CancellationToken cancellationToken)
        {
            List<Role> roles = await _roleService.GetAll(clubId, cancellationToken);

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
