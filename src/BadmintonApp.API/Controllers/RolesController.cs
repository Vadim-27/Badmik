using BadmintonApp.API.Extensions;
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
    [Route("api")]
    //[Authorize]
    public class RolesController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RolesController(IRoleService roleService)
        {
            _roleService = roleService;
        }
        [HttpPost("clubs/{clubId:guid}/staff/{staffId:guid}/roles/{roleId:guid}")]
        public async Task<IActionResult> AssignRoleToStaff(Guid clubId, Guid staffId,Guid roleId, CancellationToken cancellationToken)
        {
            await _roleService.AssignRoleForStaff(staffId, clubId, roleId, cancellationToken);
            return Ok();
        }

        [HttpDelete("clubs/{clubId:guid}/staff/{staffId:guid}/roles/{roleId:guid}")]
        public async Task<IActionResult> RemoveRoleFromStaff(Guid clubId, Guid staffId, Guid roleId, CancellationToken cancellationToken)
        {
            await _roleService.RemoveRoleFromStaff(staffId, clubId, roleId, cancellationToken);
            return Ok();
        }


        [HttpGet("clubs/{clubId:guid}/roles")]
        public async Task<ActionResult> GetAllByClubId(Guid clubId, CancellationToken cancellationToken)
        {
            List<Role> roles = await _roleService.GetAll(clubId, cancellationToken);

            return Ok(roles);
        }

        [HttpPost("roles/{roleId:guid}/permissions/{permissionId:guid}")]
        public async Task<IActionResult> AddPermissionToRole(Guid roleId, Guid permissionId, CancellationToken cancellationToken) 
        {
            await _roleService.RoleBindPermission(User.GetUserId(), User.GetClubId(), roleId, permissionId, cancellationToken);

            return Ok();
        }

        // DELETE /api/roles/{roleId}/permissions/{permissionId}
        [HttpDelete("roles/{roleId:guid}/permissions/{permissionId:guid}")]
        public async Task<IActionResult> RemovePermissionFromRole(Guid roleId, Guid permissionId, CancellationToken cancellationToken)
        {
            await _roleService.RoleDeletePermission(User.GetUserId(), User.GetClubId(), roleId, permissionId, cancellationToken);

            return Ok();
        }

        [HttpGet("staff/{staffId:guid}/roles")]
        public async Task<ActionResult> GetRolesByStaffId(Guid staffId, CancellationToken cancellationToken)
        {
            List<Role> roles = await _roleService.GetRolesByStaffId(staffId, cancellationToken);

            return Ok(roles);
        }
        


    }
}
