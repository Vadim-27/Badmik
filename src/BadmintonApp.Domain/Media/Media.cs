using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Media;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Media
{
    public class MediaItem
    {
        public Guid Id { get; set; }

        public EntityType OwnerType { get; set; }
        public Guid OwnerId { get; set; }

        public MediaKind Kind { get; set; }          

        public string Url { get; set; } = default!;
        public string? ThumbUrl { get; set; }

        public int SortOrder { get; set; }

        public string ContentType { get; set; } = default!;
        public long SizeBytes { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
