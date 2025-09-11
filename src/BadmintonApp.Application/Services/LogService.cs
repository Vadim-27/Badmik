using AutoMapper;
using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Logs;
using BadmintonApp.Application.Interfaces.Logs;
using BadmintonApp.Application.Interfaces.Repositories;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services;

public class LogService : ILogService
{
    private readonly ILogRepository _logRepository;
    private readonly IMapper _mapper;

    public LogService(ILogRepository logRepository, IMapper mapper)
    {
        _logRepository = logRepository;
        _mapper = mapper;
    }

    public async Task<PaginationListDto<LogDto>> GetLogsByFilters(
        GetLogsFilterDto getLogsFilterDto,
        CancellationToken cancellationToken)

    {
        var list = await _logRepository.GetLogsByFilters(getLogsFilterDto, cancellationToken);        

        return new PaginationListDto<LogDto> 
        {
            List = list.Select(x => _mapper.Map<LogDto>(x)).ToList(),
            TotalCount = await _logRepository.GetTotalCountLogsByFilter(getLogsFilterDto, cancellationToken)
        };
    }
}
