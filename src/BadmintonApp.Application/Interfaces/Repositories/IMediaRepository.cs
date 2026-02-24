using BadmintonApp.Domain.Enums;
using BadmintonApp.Domain.Enums.Media;
using BadmintonApp.Domain.Media;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Repositories
{
    public interface IMediaRepository
    {
        Task<Domain.Media.MediaItem> GetSingleAsync(EntityType ownerType, Guid ownerId, MediaKind kind, CancellationToken ct);

        Task<List<Domain.Media.MediaItem>> GetListAsync(EntityType ownerType, Guid ownerId, MediaKind kind, CancellationToken ct);
        Task<List<MediaItem>> GetListAsync(EntityType ownerType, IReadOnlyCollection<Guid> ownerIds, MediaKind kind, CancellationToken ct);

        Task<int?> GetMaxSortOrderAsync(EntityType ownerType, Guid ownerId, MediaKind kind, CancellationToken ct);

        Task<Domain.Media.MediaItem?> GetByIdAsync(Guid id, CancellationToken ct);

        void Add(Domain.Media.MediaItem entity);
        void AddRange(IEnumerable<Domain.Media.MediaItem> entities);
        void Remove(Domain.Media.MediaItem entity);

        Task SaveChangesAsync(CancellationToken ct);
    }
}
