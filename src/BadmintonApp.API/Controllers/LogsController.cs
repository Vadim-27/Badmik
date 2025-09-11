using BadmintonApp.Application.DTOs.Logs;
using BadmintonApp.Application.Interfaces.Logs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.API.Controllers
{
    [ApiController]
    [Route("api/logs")]
    [Authorize]
    public class LogsController : ControllerBase
    {
        private readonly ILogService _logService;

        public LogsController(ILogService logService)
        {
            _logService = logService;
        }

        [HttpGet]
        public async Task<ActionResult> GetLogsByFilter([FromQuery] GetLogsFilterDto dto, CancellationToken cancellationToken)
        {
            return Ok(await _logService.GetLogsByFilters(dto, cancellationToken));
        }
    }
}
