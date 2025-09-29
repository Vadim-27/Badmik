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
        [HttpPost]
        public async Task<ActionResult> AssignRoleForUser([FromBody] AssignRoleForUserDto assignRoleForUserDto, CancellationToken cancellationToken)
        {
            await _roleService.AssignRoleForUser(assignRoleForUserDto.UserId, assignRoleForUserDto.ClubId, assignRoleForUserDto.RoleId, cancellationToken);

            return Ok();
        }

        [HttpGet]
        public async Task<ActionResult> GetAll(CancellationToken cancellationToken)
        {
            List<Role> roles = await _roleService.GetAll(cancellationToken);

            return Ok(roles);
        }

        [HttpPut]
        public async Task<ActionResult> BindPermission([FromBody] RoleBindPermissionDto dto, CancellationToken cancellationToken)
        {
            await _roleService.RoleBindPermission(dto.RoleId, dto.PermissionId, cancellationToken);

            return Ok();
        }

        [HttpDelete]
        public async Task<ActionResult> DeletePermission([FromBody] RoleBindPermissionDto dtoDelete, CancellationToken cancellationToken)
        {
            await _roleService.RoleDeletePermission(dtoDelete.RoleId, dtoDelete.PermissionId, cancellationToken);

            return Ok();
        }

        
    }
}
