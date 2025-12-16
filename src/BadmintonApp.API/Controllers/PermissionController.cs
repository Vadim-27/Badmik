using BadmintonApp.Application.Interfaces.Permissions;
using BadmintonApp.Domain.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;


namespace BadmintonApp.API.Controllers
{
    [ApiController]
    [Route("api/permissions")]
    //[Authorize]
    public class PermissionController : ControllerBase
    {
        private readonly IPermissionService _permissionService;

        public PermissionController(IPermissionService permissionService)
        {
            _permissionService = permissionService;
        }

        [HttpGet("")]
        public async Task<ActionResult> GetAll(CancellationToken cancellationToken)
        {            
            return Ok(await _permissionService.GetAll(cancellationToken));
        }
    }
}
