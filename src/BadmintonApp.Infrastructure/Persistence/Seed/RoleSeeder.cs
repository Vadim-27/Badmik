using BadmintonApp.Domain.Permissions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Infrastructure.Persistence.Seed
{
    public static class RoleSeeder
    {
        public static List<Role> GetPredefinedRoles()
        {
            return new List<Role>
            {
                new Role
                {
                    Type = RoleType.SuperAdmin,
                    Name = "Super Admin",
                    Permissions = new List<PermissionType>
                    {
                        PermissionType.ClubsView,
                        PermissionType.PlayesManage,
                        PermissionType.ClubsAssignAdmin,
                        PermissionType.ClubsManageAll,
                        PermissionType.TrainingsManage,
                        PermissionType.ClubsManageOwn,
                        PermissionType.RolesManage,
                        PermissionType.AnalyticsViewAll,
                        PermissionType.AnalyticsViewOwn
                    }
                },
                new Role
                {
                    Type = RoleType.ClubAdmin,
                    Name = "Club Admin",
                    Permissions = new List<PermissionType>
                    {
                        PermissionType.ClubsView,
                        PermissionType.ClubsManageOwn,
                        PermissionType.PlayesManage,
                        PermissionType.TrainingsManage,
                        PermissionType.AnalyticsViewOwn
                    }
                },
                new Role
                {
                    Type = RoleType.ClubManager,
                    Name = "Club Manager",
                    Permissions = new List<PermissionType>
                    {
                        PermissionType.PlayesManage,
                        PermissionType.TrainingsManage,
                        PermissionType.ClubsManageOwn
                    }
                }
            };
        }
    }
