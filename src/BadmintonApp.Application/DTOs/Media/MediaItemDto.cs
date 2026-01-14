using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Media
{
    public class MediaItemDto
    {
        public Guid Id { get; set; }

        public string Url { get; set; } = default!;
        public string? ThumbUrl { get; set; }

        public int SortOrder { get; set; }

        public string ContentType { get; set; } = default!;
        public long SizeBytes { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
