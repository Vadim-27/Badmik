using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Paginations;
using System.Collections.Generic;
using System.Linq;

namespace BadmintonApp.Application.Extension;

internal static class PaginationExtensions
{
    public static PaginationListDto<T> AsPagination<T>(this IQueryable<T> query, PaginationFilterDto filter)
    {
        return new PaginationListDto<T>
        {
            List = query
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToList(),
            TotalCount = query.Count()
        };
    }

    public static PaginationListDto<TDest> AsPagination<TSource, TDest>(this PaginationListDto<TSource> page, AutoMapper.IMapper mapper)
    {
        return new PaginationListDto<TDest>
        {
            List = mapper.Map<List<TDest>>(page.List),
            TotalCount = page.TotalCount,
            Page = page.Page,
            PageSize = page.PageSize
        };
    }
}
