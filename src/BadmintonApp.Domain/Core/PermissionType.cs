using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Core
{
    public enum PermissionType
    {
        //ClubsView = 1,
        //PlayersManage = 2,
        //ClubsAssignAdmin = 3,
        //ClubsManageAll = 4,
        //TrainingsManage = 5,
        //ClubsManageOwn = 6,
        //RolesManage = 7,
        //AnalyticsViewAll = 8,
        //AnalyticsViewOwn = 9,

        // 1–19: Club & Locations
        ClubView = 1, // View club data, club dashboard 0
        ClubSettingsManage = 2, // Manage club settings (name, alias, hours, branding) 1
        LocationsView = 3, // View locations/venues 2
        LocationsManage = 4, // Manage locations and working hours 3
        CourtsManage = 5, // Manage court count/status, temporary closures 4
        // 20–39: Trainings
        TrainingsView = 20, // List, details, calendar 5
        TrainingsManage = 21, // CRUD trainings, move, duplicate 6
        TrainingsRegisterPlayer = 22, // Register player (on behalf of club) 7
        TrainingsCancelPlayer = 23, // Cancel player registration (on behalf of club) 8
        TrainingsQueueManage = 24, // Manage training queue 9
        TrainingsAttendanceMark = 25, // Mark attendance / no‑show 10
        TrainingsLevelOverride = 26, // Allow player beyond level restriction 11
        // 50–69: Players
        PlayersView = 50, // View players and profiles 12
        PlayersManage = 51, // CRUD players, level, notes, invitations 13
        PlayersBalanceManage = 52, // (optional) Balance, memberships, credits 14
        // 80–99: Staff & Roles
        StaffView = 80, // View staff members of the club 15
        StaffManage = 81, // Add/edit/deactivate staff 16
        RolesView = 90, // View local club roles 17
        RolesManage = 91, // Create/edit/delete local roles 18
        RolePermissionsAssign = 92, // Assign permissions to local roles 19
        // 110–129: Notifications
        NotificationsView = 110, // View notification templates 20
        NotificationsManage = 111, // Manage templates, variables, and campaigns 21
        // 130–139: Analytics
        AnalyticsView = 130, // View club analytics, trends, attendance 22
        // 140–149: Media / Branding
        MediaManage = 140, // Manage logos, banners, gallery 23
        // 160–169: Logs / Audit
        LogsView = 160, // View activity logs within the club 24
        // 180–189: Finance (optional)
        FinanceView = 180, // View financial reports 25
        FinanceManage = 181, // Manage pricing, payments, refunds 26
    }


    public static class PermissionCodeExtensions
    {
        public static string ToCode(this PermissionType permission)
        {
            return permission.ToString().Replace("_", ".").ToLower();
        }
    }
}
