using System;
using System.Collections.Generic;

namespace BadmintonApp.Domain.Pagination;

public class PaginationQuery
{    
    public int Page { get; init; }
    public int PerPage { get; init; }
}
