using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BadmintonApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class add_PerTrainingRate_New_Permisions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("08556e74-e70f-4f19-8322-8a6371a359b7"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("12e48bab-edee-4833-830d-129f36e26c71"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("31f6a90f-2d85-4d9d-92aa-85e702289278"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("37368913-d1ac-488a-ad47-44d75c453f5a"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("7167cda8-c1b8-425b-af52-eb9aa3e27d2b"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("a5263fcf-69e8-47b2-8bf4-466a71292137"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("ac341087-ee9a-49c1-ac8b-0b34e28cdee8"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("b0010909-dd1e-4e33-ab89-7a09fddcbf49"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("fe2da074-fff1-426f-b045-44427951a6eb"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("31f6a90f-2d85-4d9d-92aa-85e702289278"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("37368913-d1ac-488a-ad47-44d75c453f5a"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("7167cda8-c1b8-425b-af52-eb9aa3e27d2b"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("b0010909-dd1e-4e33-ab89-7a09fddcbf49"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("fe2da074-fff1-426f-b045-44427951a6eb"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("31f6a90f-2d85-4d9d-92aa-85e702289278"), new Guid("bb074c39-08df-45d9-8e74-5b6a07257883") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("37368913-d1ac-488a-ad47-44d75c453f5a"), new Guid("bb074c39-08df-45d9-8e74-5b6a07257883") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("b0010909-dd1e-4e33-ab89-7a09fddcbf49"), new Guid("bb074c39-08df-45d9-8e74-5b6a07257883") });

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("08556e74-e70f-4f19-8322-8a6371a359b7"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("12e48bab-edee-4833-830d-129f36e26c71"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("31f6a90f-2d85-4d9d-92aa-85e702289278"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("37368913-d1ac-488a-ad47-44d75c453f5a"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("7167cda8-c1b8-425b-af52-eb9aa3e27d2b"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("a5263fcf-69e8-47b2-8bf4-466a71292137"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("ac341087-ee9a-49c1-ac8b-0b34e28cdee8"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("b0010909-dd1e-4e33-ab89-7a09fddcbf49"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("fe2da074-fff1-426f-b045-44427951a6eb"));

            migrationBuilder.AddColumn<decimal>(
                name: "PerTrainingRate",
                table: "Staffs",
                type: "TEXT",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.InsertData(
                table: "Permissions",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("1740be12-b8a1-40db-b184-d43fd3f6b0fa"), "FinanceView" },
                    { new Guid("2264ae2c-73b2-4a8f-8e92-cc38d4cd6b6c"), "TrainingsAttendanceMark" },
                    { new Guid("274e546f-78b0-4dc2-a7bc-548f5e92f4cc"), "NotificationsManage" },
                    { new Guid("4a6970f1-ff3e-43fd-9172-c4f3f6c2c4c7"), "AnalyticsView" },
                    { new Guid("4fd7483a-2436-4c2c-bdd3-275e595dcd1e"), "TrainingsQueueManage" },
                    { new Guid("66d2b5fd-f0fd-4c29-92d6-e165fce4096f"), "PlayersView" },
                    { new Guid("6c2dba59-81c2-4d06-a476-66c7cf930a50"), "RolesView" },
                    { new Guid("6e378e33-7c14-41d8-9005-3211ac337ada"), "TrainingsView" },
                    { new Guid("79d4ef1a-8a4a-4cb2-b63a-2307698de15b"), "NotificationsView" },
                    { new Guid("7c918f93-79b3-4f0f-91de-798a888d8ec9"), "StaffView" },
                    { new Guid("94a13b97-2e03-41df-9c4e-84db8f5a05a1"), "PlayersBalanceManage" },
                    { new Guid("95a05b7b-e88d-48c1-9e65-0cfc2c4a09f6"), "RolePermissionsAssign" },
                    { new Guid("9f29376d-dbc5-4a1a-85c3-cd6d0cbac9a6"), "RolesManage" },
                    { new Guid("aa0d8c57-e388-4db4-9746-b6cc4b47fd0d"), "LogsView" },
                    { new Guid("b3a08f9f-263e-42cc-b02a-85b5c6a5979b"), "TrainingsLevelOverride" },
                    { new Guid("bb144aa6-d452-4c65-8dd8-26e83a343d10"), "ClubView" },
                    { new Guid("bcfd34b3-d0aa-4a84-a68e-d1c58e0a0f36"), "TrainingsRegisterPlayer" },
                    { new Guid("c17101a7-c7f5-4cfc-99c4-c9e7bff062e0"), "LocationsView" },
                    { new Guid("d474449e-3045-4418-89c7-5a7599e58033"), "FinanceManage" },
                    { new Guid("dc24d312-1e12-455e-b58d-6a5e0e1c5a26"), "ClubSettingsManage" },
                    { new Guid("e30aa5ae-2e19-4a5b-a9be-40cc74bb25e4"), "TrainingsCancelPlayer" },
                    { new Guid("e47c2949-6cf3-4c2f-b6b0-e252b456cacf"), "PlayersManage" },
                    { new Guid("e804d9ec-17e5-4cb1-97fd-d033379b2a1e"), "LocationsManage" },
                    { new Guid("f3a9df19-ea7c-4a90-a3ee-238c7f745f5f"), "MediaManage" },
                    { new Guid("f42d1226-3c8a-4690-a9cb-702d81e9d134"), "CourtsManage" },
                    { new Guid("f88b5e0f-78ec-40b0-ade6-dc6c0414d6b4"), "StaffManage" },
                    { new Guid("fbcc2933-164c-4f37-a9e7-11868c34dc64"), "TrainingsManage" }
                });

            migrationBuilder.InsertData(
                table: "RolePermissions",
                columns: new[] { "PermissionId", "RoleId" },
                values: new object[,]
                {
                    { new Guid("1740be12-b8a1-40db-b184-d43fd3f6b0fa"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("2264ae2c-73b2-4a8f-8e92-cc38d4cd6b6c"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("274e546f-78b0-4dc2-a7bc-548f5e92f4cc"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("4a6970f1-ff3e-43fd-9172-c4f3f6c2c4c7"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("4fd7483a-2436-4c2c-bdd3-275e595dcd1e"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("66d2b5fd-f0fd-4c29-92d6-e165fce4096f"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("6c2dba59-81c2-4d06-a476-66c7cf930a50"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("6e378e33-7c14-41d8-9005-3211ac337ada"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("79d4ef1a-8a4a-4cb2-b63a-2307698de15b"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("7c918f93-79b3-4f0f-91de-798a888d8ec9"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("94a13b97-2e03-41df-9c4e-84db8f5a05a1"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("95a05b7b-e88d-48c1-9e65-0cfc2c4a09f6"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("9f29376d-dbc5-4a1a-85c3-cd6d0cbac9a6"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("aa0d8c57-e388-4db4-9746-b6cc4b47fd0d"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("b3a08f9f-263e-42cc-b02a-85b5c6a5979b"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("bb144aa6-d452-4c65-8dd8-26e83a343d10"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("bcfd34b3-d0aa-4a84-a68e-d1c58e0a0f36"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("c17101a7-c7f5-4cfc-99c4-c9e7bff062e0"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("d474449e-3045-4418-89c7-5a7599e58033"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("dc24d312-1e12-455e-b58d-6a5e0e1c5a26"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("e30aa5ae-2e19-4a5b-a9be-40cc74bb25e4"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("e47c2949-6cf3-4c2f-b6b0-e252b456cacf"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("e804d9ec-17e5-4cb1-97fd-d033379b2a1e"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("f3a9df19-ea7c-4a90-a3ee-238c7f745f5f"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("f42d1226-3c8a-4690-a9cb-702d81e9d134"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("f88b5e0f-78ec-40b0-ade6-dc6c0414d6b4"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("fbcc2933-164c-4f37-a9e7-11868c34dc64"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("1740be12-b8a1-40db-b184-d43fd3f6b0fa"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("2264ae2c-73b2-4a8f-8e92-cc38d4cd6b6c"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("274e546f-78b0-4dc2-a7bc-548f5e92f4cc"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("4a6970f1-ff3e-43fd-9172-c4f3f6c2c4c7"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("4fd7483a-2436-4c2c-bdd3-275e595dcd1e"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("66d2b5fd-f0fd-4c29-92d6-e165fce4096f"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("6c2dba59-81c2-4d06-a476-66c7cf930a50"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("6e378e33-7c14-41d8-9005-3211ac337ada"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("79d4ef1a-8a4a-4cb2-b63a-2307698de15b"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("7c918f93-79b3-4f0f-91de-798a888d8ec9"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("94a13b97-2e03-41df-9c4e-84db8f5a05a1"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("95a05b7b-e88d-48c1-9e65-0cfc2c4a09f6"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("9f29376d-dbc5-4a1a-85c3-cd6d0cbac9a6"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("aa0d8c57-e388-4db4-9746-b6cc4b47fd0d"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("b3a08f9f-263e-42cc-b02a-85b5c6a5979b"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("bb144aa6-d452-4c65-8dd8-26e83a343d10"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("bcfd34b3-d0aa-4a84-a68e-d1c58e0a0f36"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("c17101a7-c7f5-4cfc-99c4-c9e7bff062e0"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("d474449e-3045-4418-89c7-5a7599e58033"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("dc24d312-1e12-455e-b58d-6a5e0e1c5a26"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("e30aa5ae-2e19-4a5b-a9be-40cc74bb25e4"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("e47c2949-6cf3-4c2f-b6b0-e252b456cacf"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("e804d9ec-17e5-4cb1-97fd-d033379b2a1e"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("f3a9df19-ea7c-4a90-a3ee-238c7f745f5f"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("f42d1226-3c8a-4690-a9cb-702d81e9d134"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("f88b5e0f-78ec-40b0-ade6-dc6c0414d6b4"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("fbcc2933-164c-4f37-a9e7-11868c34dc64"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("1740be12-b8a1-40db-b184-d43fd3f6b0fa"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("2264ae2c-73b2-4a8f-8e92-cc38d4cd6b6c"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("274e546f-78b0-4dc2-a7bc-548f5e92f4cc"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("4a6970f1-ff3e-43fd-9172-c4f3f6c2c4c7"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("4fd7483a-2436-4c2c-bdd3-275e595dcd1e"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("66d2b5fd-f0fd-4c29-92d6-e165fce4096f"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("6c2dba59-81c2-4d06-a476-66c7cf930a50"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("6e378e33-7c14-41d8-9005-3211ac337ada"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("79d4ef1a-8a4a-4cb2-b63a-2307698de15b"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("7c918f93-79b3-4f0f-91de-798a888d8ec9"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("94a13b97-2e03-41df-9c4e-84db8f5a05a1"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("95a05b7b-e88d-48c1-9e65-0cfc2c4a09f6"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("9f29376d-dbc5-4a1a-85c3-cd6d0cbac9a6"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("aa0d8c57-e388-4db4-9746-b6cc4b47fd0d"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("b3a08f9f-263e-42cc-b02a-85b5c6a5979b"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("bb144aa6-d452-4c65-8dd8-26e83a343d10"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("bcfd34b3-d0aa-4a84-a68e-d1c58e0a0f36"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("c17101a7-c7f5-4cfc-99c4-c9e7bff062e0"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("d474449e-3045-4418-89c7-5a7599e58033"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("dc24d312-1e12-455e-b58d-6a5e0e1c5a26"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("e30aa5ae-2e19-4a5b-a9be-40cc74bb25e4"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("e47c2949-6cf3-4c2f-b6b0-e252b456cacf"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("e804d9ec-17e5-4cb1-97fd-d033379b2a1e"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("f3a9df19-ea7c-4a90-a3ee-238c7f745f5f"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("f42d1226-3c8a-4690-a9cb-702d81e9d134"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("f88b5e0f-78ec-40b0-ade6-dc6c0414d6b4"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("fbcc2933-164c-4f37-a9e7-11868c34dc64"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("1740be12-b8a1-40db-b184-d43fd3f6b0fa"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("2264ae2c-73b2-4a8f-8e92-cc38d4cd6b6c"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("274e546f-78b0-4dc2-a7bc-548f5e92f4cc"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("4a6970f1-ff3e-43fd-9172-c4f3f6c2c4c7"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("4fd7483a-2436-4c2c-bdd3-275e595dcd1e"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("66d2b5fd-f0fd-4c29-92d6-e165fce4096f"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("6c2dba59-81c2-4d06-a476-66c7cf930a50"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("6e378e33-7c14-41d8-9005-3211ac337ada"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("79d4ef1a-8a4a-4cb2-b63a-2307698de15b"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("7c918f93-79b3-4f0f-91de-798a888d8ec9"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("94a13b97-2e03-41df-9c4e-84db8f5a05a1"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("95a05b7b-e88d-48c1-9e65-0cfc2c4a09f6"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("9f29376d-dbc5-4a1a-85c3-cd6d0cbac9a6"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("aa0d8c57-e388-4db4-9746-b6cc4b47fd0d"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("b3a08f9f-263e-42cc-b02a-85b5c6a5979b"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("bb144aa6-d452-4c65-8dd8-26e83a343d10"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("bcfd34b3-d0aa-4a84-a68e-d1c58e0a0f36"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("c17101a7-c7f5-4cfc-99c4-c9e7bff062e0"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("d474449e-3045-4418-89c7-5a7599e58033"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("dc24d312-1e12-455e-b58d-6a5e0e1c5a26"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("e30aa5ae-2e19-4a5b-a9be-40cc74bb25e4"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("e47c2949-6cf3-4c2f-b6b0-e252b456cacf"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("e804d9ec-17e5-4cb1-97fd-d033379b2a1e"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("f3a9df19-ea7c-4a90-a3ee-238c7f745f5f"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("f42d1226-3c8a-4690-a9cb-702d81e9d134"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("f88b5e0f-78ec-40b0-ade6-dc6c0414d6b4"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("fbcc2933-164c-4f37-a9e7-11868c34dc64"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") });

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("1740be12-b8a1-40db-b184-d43fd3f6b0fa"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("2264ae2c-73b2-4a8f-8e92-cc38d4cd6b6c"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("274e546f-78b0-4dc2-a7bc-548f5e92f4cc"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("4a6970f1-ff3e-43fd-9172-c4f3f6c2c4c7"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("4fd7483a-2436-4c2c-bdd3-275e595dcd1e"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("66d2b5fd-f0fd-4c29-92d6-e165fce4096f"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("6c2dba59-81c2-4d06-a476-66c7cf930a50"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("6e378e33-7c14-41d8-9005-3211ac337ada"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("79d4ef1a-8a4a-4cb2-b63a-2307698de15b"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("7c918f93-79b3-4f0f-91de-798a888d8ec9"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("94a13b97-2e03-41df-9c4e-84db8f5a05a1"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("95a05b7b-e88d-48c1-9e65-0cfc2c4a09f6"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("9f29376d-dbc5-4a1a-85c3-cd6d0cbac9a6"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("aa0d8c57-e388-4db4-9746-b6cc4b47fd0d"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("b3a08f9f-263e-42cc-b02a-85b5c6a5979b"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("bb144aa6-d452-4c65-8dd8-26e83a343d10"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("bcfd34b3-d0aa-4a84-a68e-d1c58e0a0f36"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("c17101a7-c7f5-4cfc-99c4-c9e7bff062e0"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("d474449e-3045-4418-89c7-5a7599e58033"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("dc24d312-1e12-455e-b58d-6a5e0e1c5a26"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("e30aa5ae-2e19-4a5b-a9be-40cc74bb25e4"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("e47c2949-6cf3-4c2f-b6b0-e252b456cacf"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("e804d9ec-17e5-4cb1-97fd-d033379b2a1e"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("f3a9df19-ea7c-4a90-a3ee-238c7f745f5f"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("f42d1226-3c8a-4690-a9cb-702d81e9d134"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("f88b5e0f-78ec-40b0-ade6-dc6c0414d6b4"));

            migrationBuilder.DeleteData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("fbcc2933-164c-4f37-a9e7-11868c34dc64"));

            migrationBuilder.DropColumn(
                name: "PerTrainingRate",
                table: "Staffs");

            migrationBuilder.InsertData(
                table: "Permissions",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("08556e74-e70f-4f19-8322-8a6371a359b7"), "RolesManage" },
                    { new Guid("12e48bab-edee-4833-830d-129f36e26c71"), "AnalyticsViewOwn" },
                    { new Guid("31f6a90f-2d85-4d9d-92aa-85e702289278"), "PlayersManage" },
                    { new Guid("37368913-d1ac-488a-ad47-44d75c453f5a"), "TrainingsManage" },
                    { new Guid("7167cda8-c1b8-425b-af52-eb9aa3e27d2b"), "AnalyticsViewAll" },
                    { new Guid("a5263fcf-69e8-47b2-8bf4-466a71292137"), "ClubsManageAll" },
                    { new Guid("ac341087-ee9a-49c1-ac8b-0b34e28cdee8"), "ClubsAssignAdmin" },
                    { new Guid("b0010909-dd1e-4e33-ab89-7a09fddcbf49"), "ClubsManageOwn" },
                    { new Guid("fe2da074-fff1-426f-b045-44427951a6eb"), "ClubsView" }
                });

            migrationBuilder.InsertData(
                table: "RolePermissions",
                columns: new[] { "PermissionId", "RoleId" },
                values: new object[,]
                {
                    { new Guid("08556e74-e70f-4f19-8322-8a6371a359b7"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("12e48bab-edee-4833-830d-129f36e26c71"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("31f6a90f-2d85-4d9d-92aa-85e702289278"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("37368913-d1ac-488a-ad47-44d75c453f5a"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("7167cda8-c1b8-425b-af52-eb9aa3e27d2b"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("a5263fcf-69e8-47b2-8bf4-466a71292137"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("ac341087-ee9a-49c1-ac8b-0b34e28cdee8"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("b0010909-dd1e-4e33-ab89-7a09fddcbf49"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("fe2da074-fff1-426f-b045-44427951a6eb"), new Guid("45225223-0e47-4c7a-b045-38de629412e5") },
                    { new Guid("31f6a90f-2d85-4d9d-92aa-85e702289278"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("37368913-d1ac-488a-ad47-44d75c453f5a"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("7167cda8-c1b8-425b-af52-eb9aa3e27d2b"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("b0010909-dd1e-4e33-ab89-7a09fddcbf49"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("fe2da074-fff1-426f-b045-44427951a6eb"), new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174") },
                    { new Guid("31f6a90f-2d85-4d9d-92aa-85e702289278"), new Guid("bb074c39-08df-45d9-8e74-5b6a07257883") },
                    { new Guid("37368913-d1ac-488a-ad47-44d75c453f5a"), new Guid("bb074c39-08df-45d9-8e74-5b6a07257883") },
                    { new Guid("b0010909-dd1e-4e33-ab89-7a09fddcbf49"), new Guid("bb074c39-08df-45d9-8e74-5b6a07257883") }
                });
        }
    }
}
