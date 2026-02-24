using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Media
{
    public sealed class MediaOptions
    {
        public string RootPath { get; set; } = default!;
        public string PublicBasePath { get; set; } = "/media";

    }
}
