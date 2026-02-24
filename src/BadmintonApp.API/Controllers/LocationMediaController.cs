using BadmintonApp.Application.DTOs.Media;
using BadmintonApp.Application.Interfaces.Media;
using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Media;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.API.Controllers;

[ApiController]
[Route("api/locations")]
public class LocationMediaController : ControllerBase
{
    private readonly IMediaService _media;

    public LocationMediaController(IMediaService media)
    {
        _media = media;
    }

    [HttpPut("{id:guid}/logo")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<MediaItemDto>> UploadLogo(Guid id, IFormFile file, CancellationToken ct)
    {
        if (file == null || file.Length == 0) return BadRequest("File is required.");
        var result = await _media.UploadSingleAsync(EntityType.Location, id, MediaKind.Logo, file, ct);
        return Ok(result);
    }

    [HttpDelete("{id:guid}/logo")]
    public async Task<IActionResult> DeleteLogo(Guid id, CancellationToken ct)
    {
        await _media.DeleteSingleAsync(EntityType.Location, id, MediaKind.Logo, ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/images")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<List<MediaItemDto>>> UploadGallery(Guid id, List<IFormFile> files, CancellationToken ct)
    {
        if (files == null || files.Count == 0) return BadRequest("Files are required.");
        var result = await _media.UploadManyAsync(EntityType.Location, id, MediaKind.Gallery, files, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}/images")]
    public async Task<ActionResult<List<MediaItemDto>>> GetGallery(Guid id, CancellationToken ct)
    {
        var result = await _media.GetAsync(EntityType.Location, id, MediaKind.Gallery, ct);
        return Ok(result);
    }

    [HttpPut("{id:guid}/images/order")]
    public async Task<IActionResult> Reorder(Guid id, [FromBody] ReorderMediaDto dto, CancellationToken ct)
    {
        await _media.ReorderAsync(EntityType.Location, id, MediaKind.Gallery, dto.Items, ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}/images/{mediaId:guid}")]
    public async Task<IActionResult> DeleteImage(Guid id, Guid mediaId, CancellationToken ct)
    {
        await _media.DeleteAsync(EntityType.Location, id, MediaKind.Gallery, mediaId, ct);
        return NoContent();
    }

    [HttpGet("{id:guid}/logo")]
    public async Task<ActionResult<MediaItemDto?>> GetLogo(Guid id, CancellationToken ct)
    {
        var items = await _media.GetAsync(EntityType.Location, id, MediaKind.Logo, ct);
        return Ok(items.FirstOrDefault()); // або null
    }
}