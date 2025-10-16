using System.Collections.Generic;

namespace BadmintonApp.Application.DTOs.Paginations;

public class PaginationListDto<T>
{
    public List<T> List { get; set; }
    public int TotalCount { get; set; }
}
