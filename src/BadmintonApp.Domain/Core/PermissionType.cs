using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Core
{
    public enum PermissionType
    {
        ClubsView = 1,
        PlayersManage = 2,
        ClubsAssignAdmin = 3,
        ClubsManageAll = 4,
        TrainingsManage = 5,
        ClubsManageOwn = 6,
        RolesManage = 7,
        AnalyticsViewAll = 8,
        AnalyticsViewOwn = 9,
    }


    public static class PermissionCodeExtensions
    {
        public static string ToCode(this PermissionType permission)
        {
            return permission.ToString().Replace("_", ".").ToLower();
        }
    }
}
