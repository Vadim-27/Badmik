using BadmintonApp.Application.DTOs.Media;
using BadmintonApp.Application.Interfaces.Media;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Media;
using BadmintonApp.Domain.Media;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Services;

public class MediaService : IMediaService
{
    private readonly IMediaRepository _mediaRepository;
    private readonly IMediaStorage _mediaStorage;
    private readonly IConfiguration _cfg;

    public MediaService(IMediaRepository mediaRepository, IMediaStorage mediaStorage, IConfiguration cfg)
    {
        _mediaRepository = mediaRepository;
        _mediaStorage = mediaStorage;
        _cfg = cfg;
    }

    private string RootPath => _cfg["Media:RootPath"] ?? throw new InvalidOperationException("Media:RootPath is not configured");
    private string PublicBasePath => _cfg["Media:PublicBasePath"] ?? "/media";

    public async Task<MediaItemDto> UploadSingleAsync(EntityType ownerType, Guid ownerId, MediaKind kind, IFormFile file, CancellationToken ct)
    {
        ValidateImage(file);

        // remove old single (Logo/Cover/Avatar)
        var existing = await _mediaRepository.GetSingleAsync(ownerType, ownerId, kind, ct);
        if (existing != null)
        {
            await DeleteStoredFilesAsync(existing, ct);
            _mediaRepository.Remove(existing);
            await _mediaRepository.SaveChangesAsync(ct);
        }

        var mediaId = Guid.NewGuid();
        var folder = BuildFolder(ownerType, ownerId, kind);

        var stored = await _mediaStorage.SaveAsync(new StoredMediaRequest
        {
            RootPath = RootPath,
            PublicBasePath = PublicBasePath,
            RelativeFolder = folder,
            MediaId = mediaId,
            File = file,
            CreateThumb = false
        }, ct);

        var entity = new MediaItem
        {
            Id = mediaId,
            OwnerType = ownerType,
            OwnerId = ownerId,
            Kind = kind,
            Url = stored.Url,
            ThumbUrl = stored.ThumbUrl,
            SortOrder = 0,
            ContentType = stored.ContentType,
            SizeBytes = stored.SizeBytes,
            CreatedAt = DateTime.UtcNow
        };

        _mediaRepository.Add(entity);
        await _mediaRepository.SaveChangesAsync(ct);

        return ToDto(entity);
    }

    public async Task DeleteSingleAsync(EntityType ownerType, Guid ownerId, MediaKind kind, CancellationToken ct)
    {
        var existing = await _mediaRepository.GetSingleAsync(ownerType, ownerId, kind, ct);
        if (existing == null) return;

        await DeleteStoredFilesAsync(existing, ct);
        _mediaRepository.Remove(existing);
        await _mediaRepository.SaveChangesAsync(ct);
    }

    public async Task<List<MediaItemDto>> UploadManyAsync(EntityType ownerType, Guid ownerId, MediaKind kind, List<IFormFile> files, CancellationToken ct)
    {
        if (kind != MediaKind.Gallery)
            throw new InvalidOperationException("UploadManyAsync is intended for Gallery kind.");

        if (files == null || files.Count == 0)
            return [];

        foreach (var f in files) ValidateImage(f);

        var folder = BuildFolder(ownerType, ownerId, kind);
        var maxSort = (await _mediaRepository.GetMaxSortOrderAsync(ownerType, ownerId, kind, ct)) ?? -1;

        var created = new List<MediaItem>(files.Count);

        foreach (var file in files)
        {
            var mediaId = Guid.NewGuid();
            var stored = await _mediaStorage.SaveAsync(new StoredMediaRequest
            {
                RootPath = RootPath,
                PublicBasePath = PublicBasePath,
                RelativeFolder = folder,
                MediaId = mediaId,
                File = file
            }, ct);

            maxSort++;

            created.Add(new MediaItem
            {
                Id = mediaId,
                OwnerType = ownerType,
                OwnerId = ownerId,
                Kind = kind,
                Url = stored.Url,
                ThumbUrl = stored.ThumbUrl,
                SortOrder = maxSort,
                ContentType = stored.ContentType,
                SizeBytes = stored.SizeBytes,
                CreatedAt = DateTime.UtcNow
            });
        }

        _mediaRepository.AddRange(created);
        await _mediaRepository.SaveChangesAsync(ct);

        return created.Select(ToDto).ToList();
    }

    public async Task<List<MediaItemDto>> GetAsync(EntityType ownerType, Guid ownerId, MediaKind kind, CancellationToken ct)
    {
        var list = await _mediaRepository.GetListAsync(ownerType, ownerId, kind, ct);
        return list
            .OrderBy(x => x.SortOrder)
            .ThenBy(x => x.CreatedAt)
            .Select(ToDto)
            .ToList();
    }

    public async Task ReorderAsync(EntityType ownerType, Guid ownerId, MediaKind kind, List<ReorderMediaItemDto> items, CancellationToken ct)
    {
        if (kind != MediaKind.Gallery)
            throw new InvalidOperationException("Reorder is intended for Gallery kind.");

        if (items == null || items.Count == 0) return;

        var current = await _mediaRepository.GetListAsync(ownerType, ownerId, kind, ct);
        var map = items.ToDictionary(x => x.Id, x => x.SortOrder);

        // мін. валідація: всі id мають належати owner
        foreach (var id in map.Keys)
        {
            if (!current.Any(m => m.Id == id))
                throw new InvalidOperationException("Some media items do not belong to the specified owner.");
        }

        foreach (var m in current)
        {
            if (map.TryGetValue(m.Id, out var so))
                m.SortOrder = so;
        }

        await _mediaRepository.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(EntityType ownerType, Guid ownerId, MediaKind kind, Guid mediaId, CancellationToken ct)
    {
        var entity = await _mediaRepository.GetByIdAsync(mediaId, ct);
        if (entity == null) return;

        if (entity.OwnerType != ownerType || entity.OwnerId != ownerId || entity.Kind != kind)
            return;

        await DeleteStoredFilesAsync(entity, ct);
        _mediaRepository.Remove(entity);
        await _mediaRepository.SaveChangesAsync(ct);
    }

    // ---- helpers ----

    private async Task DeleteStoredFilesAsync(MediaItem entity, CancellationToken ct)
    {
        await _mediaStorage.DeleteAsync(entity.Url, ct);

        if (!string.IsNullOrWhiteSpace(entity.ThumbUrl))
            await _mediaStorage.DeleteAsync(entity.ThumbUrl!, ct);
    }

    private static void ValidateImage(IFormFile file)
    {
        if (file is null || file.Length <= 0)
            throw new InvalidOperationException("Empty file.");

        var ok = file.ContentType is "image/jpeg" or "image/png" or "image/webp";
        if (!ok)
            throw new InvalidOperationException($"Unsupported content type: {file.ContentType}");

        const long maxBytes = 10 * 1024 * 1024;
        if (file.Length > maxBytes)
            throw new InvalidOperationException("File is too large.");
    }

    private static string BuildFolder(EntityType ownerType, Guid ownerId, MediaKind kind)
    {
        var owner = ownerType.ToString().ToLowerInvariant() + "s";
        var k = kind.ToString().ToLowerInvariant();
        return $"{owner}/{ownerId:D}/{k}";
    }

    private static MediaItemDto ToDto(MediaItem m) => new()
    {
        Id = m.Id,
        Url = m.Url,
        ThumbUrl = m.ThumbUrl,
        SortOrder = m.SortOrder,
        ContentType = m.ContentType,
        SizeBytes = m.SizeBytes,
        CreatedAt = m.CreatedAt
    };
}