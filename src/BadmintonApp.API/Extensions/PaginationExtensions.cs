using BadmintonApp.Application.DTOs.Common;
using BadmintonApp.Domain.Pagination;
using System.Linq;
using System.Threading;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Exсeptions
{
    internal static class PaginationExtensions
    {
        public static async Task<PaginationListDto<T>> AsPagination<T>(
        this IQueryable<T> query,
        PaginationQuery pg,
        CancellationToken ct)
        {
            var page = pg.Page < 1 ? 1 : pg.Page;
            var perPage = pg.PerPage <= 0 ? 20 : (pg.PerPage > 100 ? 100 : pg.PerPage);

            var items = await query
                .Skip((page - 1) * perPage)
                .Take(perPage)
                .ToListAsync(ct);

            var total = await query.CountAsync(ct);

            return new PaginationListDto<T>
            {
                List = items,
                TotalCount = total,
                Page = page,
                PerPage = perPage
            };
        }
    }
}
