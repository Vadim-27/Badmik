using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BadmintonApp.Domain.Media;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BadmintonApp.Infrastructure.Persistence.Configurations
{

    public class MediaConfiguration : IEntityTypeConfiguration<Domain.Media.MediaItem>
    {
        public void Configure(EntityTypeBuilder<Domain.Media.MediaItem> b)
        {
            b.ToTable("Media");

            b.HasKey(x => x.Id);

            b.Property(x => x.OwnerType).HasConversion<int>().IsRequired();
            b.Property(x => x.Kind).HasConversion<int>().IsRequired();

            b.Property(x => x.Url).HasMaxLength(1024).IsRequired();
            b.Property(x => x.ThumbUrl).HasMaxLength(1024);

            b.Property(x => x.ContentType).HasMaxLength(128).IsRequired();

            b.Property(x => x.SizeBytes).IsRequired();
            b.Property(x => x.SortOrder).IsRequired();

            b.Property(x => x.CreatedAt).IsRequired();

            b.HasIndex(x => new { x.OwnerType, x.OwnerId, x.Kind });

            b.HasIndex(x => new { x.OwnerType, x.OwnerId, x.Kind, x.SortOrder, x.CreatedAt });

        }
    }
}
