using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Permissions
{
    public class Role
    {
        public Guid Id { get; set; }
        public RoleType Type { get; set; }
        public string Name { get; set; } = null!;

        public IReadOnlyList<PermissionType> Permissions { get; set; } = new List<PermissionType>();
    }
}
