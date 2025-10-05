using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BadmintonApp.Domain.Core
{
    public enum PermissionType
    {
        // 1–19: Club & Locations
        ClubView = 1, // View club data, club dashboard
        ClubSettingsManage = 2, // Manage club settings (name, alias, hours, branding)
        LocationsView = 3, // View locations/venues
        LocationsManage = 4, // Manage locations and working hours
        CourtsManage = 5, // Manage court count/status, temporary closures


        // 20–39: Trainings
        TrainingsView = 20, // List, details, calendar
        TrainingsManage = 21, // CRUD trainings, move, duplicate
        TrainingsRegisterPlayer = 22, // Register player (on behalf of club)
        TrainingsCancelPlayer = 23, // Cancel player registration (on behalf of club)
        TrainingsQueueManage = 24, // Manage training queue
        TrainingsAttendanceMark = 25, // Mark attendance / no‑show
        TrainingsLevelOverride = 26, // Allow player beyond level restriction


        // 50–69: Players
        PlayersView = 50, // View players and profiles
        PlayersManage = 51, // CRUD players, level, notes, invitations
        PlayersBalanceManage = 52, // (optional) Balance, memberships, credits


        // 80–99: Staff & Roles
        StaffView = 80, // View staff members of the club
        StaffManage = 81, // Add/edit/deactivate staff
        RolesView = 90, // View local club roles
        RolesManage = 91, // Create/edit/delete local roles
        RolePermissionsAssign = 92, // Assign permissions to local roles


        // 110–129: Notifications
        NotificationsView = 110, // View notification templates
        NotificationsManage = 111, // Manage templates, variables, and campaigns


        // 130–139: Analytics
        AnalyticsView = 130, // View club analytics, trends, attendance


        // 140–149: Media / Branding
        MediaManage = 140, // Manage logos, banners, gallery


        // 160–169: Logs / Audit
        LogsView = 160, // View activity logs within the club


        // 180–189: Finance (optional)
        FinanceView = 180, // View financial reports
        FinanceManage = 181, // Manage pricing, payments, refunds
    }


    public static class PermissionCodeExtensions
    {
        public static string ToCode(this PermissionType permission)
        {
            return permission.ToString().Replace("_", ".").ToLower();
        }
    }
}
