using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Media
{
    public sealed class StoredMediaRequest
    {
        public required string RelativeFolder { get; init; } // "locations/{id}/gallery"
        public required Guid MediaId { get; init; }
        public required IFormFile File { get; init; }
        public bool CreateThumb { get; init; } = false;      // поки false (можеш додати пізніше)
    }
}
