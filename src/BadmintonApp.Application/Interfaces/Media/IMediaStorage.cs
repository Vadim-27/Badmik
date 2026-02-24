using BadmintonApp.Application.DTOs.Media;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces.Media
{
    public interface IMediaStorage
    {
        Task<StoredMediaResult> SaveAsync(StoredMediaRequest request, CancellationToken ct);
        Task DeleteAsync(string publicUrl, CancellationToken ct);
    }
}
