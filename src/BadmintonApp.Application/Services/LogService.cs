using AutoMapper;
using AutoMapper.QueryableExtensions;
using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Logs;
using BadmintonApp.Application.DTOs.Paginations;
using BadmintonApp.Application.Extension;
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
        await Task.Yield();
        return _logRepository.GetLogsByFilters(getLogsFilterDto, cancellationToken)
            .ProjectTo<LogDto>(_mapper.ConfigurationProvider)
            .AsPagination(getLogsFilterDto);
    }
}
