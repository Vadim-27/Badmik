using BadmintonApp.Application.DTOs.Media;
using BadmintonApp.Application.Interfaces.Media;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Media
{
    public class FileSystemMediaStorage : IMediaStorage
    {
        public async Task<StoredMediaResult> SaveAsync(StoredMediaRequest request, CancellationToken ct)
        {
            Directory.CreateDirectory(Path.Combine(request.RootPath, request.RelativeFolder));

            var ext = GuessExtension(request.File.ContentType, request.File.FileName);
            var fileName = $"{request.MediaId}{ext}";

            var diskPath = Path.Combine(request.RootPath, request.RelativeFolder, fileName);
            await using (var fs = new FileStream(diskPath, FileMode.Create, FileAccess.Write, FileShare.None, 64 * 1024, useAsync: true))
            {
                await request.File.CopyToAsync(fs, ct);
            }

            var url = CombineUrl(request.PublicBasePath, request.RelativeFolder, fileName);

            return new StoredMediaResult
            {
                Url = url,
                ThumbUrl = null,
                ContentType = request.File.ContentType,
                SizeBytes = request.File.Length
            };
        }

        public Task DeleteAsync(string publicUrl, CancellationToken ct)
        {
            throw new NotSupportedException("Use DeleteAsync overload with rootPath+publicBasePath or delete by resolved disk path.");
        }

        public Task DeleteByResolvedPathAsync(string diskPath, CancellationToken ct)
        {
            if (File.Exists(diskPath))
                File.Delete(diskPath);

            return Task.CompletedTask;
        }

        public static string ResolveDiskPath(string rootPath, string publicBasePath, string publicUrl)
        {
            // publicBasePath="/media"
            var relative = publicUrl.StartsWith(publicBasePath, StringComparison.OrdinalIgnoreCase)
                ? publicUrl.Substring(publicBasePath.Length)
                : publicUrl;

            relative = relative.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            return Path.Combine(rootPath, relative);
        }

        private static string CombineUrl(string publicBasePath, string relativeFolder, string fileName)
            => $"{publicBasePath.TrimEnd('/')}/{relativeFolder.Trim('/').Replace("\\", "/")}/{fileName}";

        private static string GuessExtension(string contentType, string originalFileName)
        {
            return contentType switch
            {
                "image/jpeg" => ".jpg",
                "image/png" => ".png",
                "image/webp" => ".webp",
                _ => Path.GetExtension(originalFileName) is { Length: > 1 } ext ? ext : ".bin"
            };
        }
    }
}