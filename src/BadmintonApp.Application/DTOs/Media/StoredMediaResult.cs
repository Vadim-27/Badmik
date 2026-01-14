using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.DTOs.Media
{
    public sealed class StoredMediaResult
    {
        public required string Url { get; init; }            
        public string? ThumbUrl { get; init; }               
        public required string ContentType { get; init; }
        public required long SizeBytes { get; init; }
    }
}
