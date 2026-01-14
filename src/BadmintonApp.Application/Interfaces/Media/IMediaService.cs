using BadmintonApp.Application.DTOs.Media;
using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Media;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Media
{
    public interface IMediaService
    {
        Task<MediaItemDto> UploadSingleAsync(EntityType ownerType, Guid ownerId, MediaKind kind, IFormFile file, CancellationToken ct);
        Task DeleteSingleAsync(EntityType ownerType, Guid ownerId, MediaKind kind, CancellationToken ct);

        Task<List<MediaItemDto>> UploadManyAsync(EntityType ownerType, Guid ownerId, MediaKind kind, List<IFormFile> files, CancellationToken ct);
        Task<List<MediaItemDto>> GetAsync(EntityType ownerType, Guid ownerId, MediaKind kind, CancellationToken ct);

        Task ReorderAsync(EntityType ownerType, Guid ownerId, MediaKind kind, List<ReorderMediaItemDto> items, CancellationToken ct);
        Task DeleteAsync(EntityType ownerType, Guid ownerId, MediaKind kind, Guid mediaId, CancellationToken ct);
    }
}
