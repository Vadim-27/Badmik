using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Common
{
    public class ClubPaginationFilterDto: PaginationFilterDto
    {
        public Guid? ClubId { get; set; }
    }
}
