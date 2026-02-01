using BadmintonApp.Domain.Media;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Extesions
{
    public static class MediaItemExtensions
    {
        public static Dictionary<Guid, MediaItem> PickPrimaryPerOwner(this IEnumerable<MediaItem> items)
        {
            return items
                .GroupBy(x => x.OwnerId)
                .ToDictionary(g => g.Key, g => g.First());
        }
    }
}
