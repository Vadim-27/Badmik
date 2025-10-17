using System.Collections.Generic;

namespace BadmintonApp.Application.DTOs.Paginations;

public class PaginationListDto<T>
{
    public List<T> List { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
