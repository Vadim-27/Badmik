using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Application.DTOs.Paginations;
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
}
