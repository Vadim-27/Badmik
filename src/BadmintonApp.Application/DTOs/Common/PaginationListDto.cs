using System.Collections.Generic;

namespace BadmintonApp.Application.DTOs.Common;

public class PaginationListDto<T>
{
    public int TotalCount { get; set; }
    public List<T> List { get; set; }
}
