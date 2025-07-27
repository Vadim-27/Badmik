﻿using BadmintonApp.Domain.Permissions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Application.Interfaces
{
    public interface IPermissionService
    {
        Task<bool> HasPermission(Guid userId, Guid clubId, PermissionType permission);
    }
}
