using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Media
{
    public class ReorderMediaDto
    {
        public List<ReorderMediaItemDto> Items { get; set; } = new();
    }

    public class ReorderMediaItemDto
    {
        public Guid Id { get; set; }
        public int SortOrder { get; set; }
    }
}
