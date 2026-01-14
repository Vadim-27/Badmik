using BadmintonApp.Application.Interfaces.Media;
using BadmintonApp.Application.Interfaces.Repositories;
using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Media;
using BadmintonApp.Domain.Media;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Repositories;

public class MediaRepository : IMediaRepository
{
    private readonly ApplicationDbContext _dbContext;

    public MediaRepository(ApplicationDbContext dbContext) => _dbContext = dbContext;

    public Task<Domain.Media.MediaItem> GetSingleAsync(EntityType ownerType, Guid ownerId, MediaKind kind, CancellationToken ct)
        => _dbContext.Media.FirstOrDefaultAsync(m => m.OwnerType == ownerType && m.OwnerId == ownerId && m.Kind == kind, ct);

    public Task<List<Domain.Media.MediaItem>> GetListAsync(EntityType ownerType, Guid ownerId, MediaKind kind, CancellationToken ct)
        => _dbContext.Media
            .Where(m => m.OwnerType == ownerType && m.OwnerId == ownerId && m.Kind == kind)
            .ToListAsync(ct);

    public Task<int?> GetMaxSortOrderAsync(EntityType ownerType, Guid ownerId, MediaKind kind, CancellationToken ct)
        => _dbContext.Media
            .Where(m => m.OwnerType == ownerType && m.OwnerId == ownerId && m.Kind == kind)
            .MaxAsync(m => (int?)m.SortOrder, ct);

    public Task<MediaItem?> GetByIdAsync(Guid id, CancellationToken ct)
        => _dbContext.Media.FirstOrDefaultAsync(m => m.Id == id, ct);

    public void Add(MediaItem entity) => _dbContext.Media.Add(entity);
    public void AddRange(IEnumerable<MediaItem> entities) => _dbContext.Media.AddRange(entities);
    public void Remove(MediaItem entity) => _dbContext.Media.Remove(entity);

    public Task SaveChangesAsync(CancellationToken ct) => _dbContext.SaveChangesAsync(ct);
}