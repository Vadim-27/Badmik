using BadmintonApp.Domain.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Configurations
{
    public class StaffClubRoleConfiguration : IEntityTypeConfiguration<StaffClubRole>
    {
        public void Configure(EntityTypeBuilder<StaffClubRole> builder)
        {
            builder.HasKey(x => new { x.StaffId, x.RoleId });

            builder.HasOne(x => x.Staff)
                   .WithMany()
                   .HasForeignKey(x => x.StaffId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.Role)
                   .WithMany()
                   .HasForeignKey(x => x.RoleId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
