namespace BadmintonApp.Application.DTOs.Common;

public class PaginationFilterDto
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
