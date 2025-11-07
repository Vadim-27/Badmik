using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BadmintonApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddStaffPositionType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Permissions");

            migrationBuilder.AlterColumn<TimeOnly>(
                name: "StartTime",
                table: "WorkingHours",
                type: "time without time zone",
                nullable: true,
                oldClrType: typeof(TimeOnly),
                oldType: "time without time zone");

            migrationBuilder.AlterColumn<TimeOnly>(
                name: "EndTime",
                table: "WorkingHours",
                type: "time without time zone",
                nullable: true,
                oldClrType: typeof(TimeOnly),
                oldType: "time without time zone");

            migrationBuilder.AddColumn<int>(
                name: "PositionType",
                table: "Staffs",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "Permissions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("1740be12-b8a1-40db-b184-d43fd3f6b0fa"),
                column: "Type",
                value: 180);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("2264ae2c-73b2-4a8f-8e92-cc38d4cd6b6c"),
                column: "Type",
                value: 25);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("274e546f-78b0-4dc2-a7bc-548f5e92f4cc"),
                column: "Type",
                value: 111);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("4a6970f1-ff3e-43fd-9172-c4f3f6c2c4c7"),
                column: "Type",
                value: 130);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("4fd7483a-2436-4c2c-bdd3-275e595dcd1e"),
                column: "Type",
                value: 24);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("66d2b5fd-f0fd-4c29-92d6-e165fce4096f"),
                column: "Type",
                value: 50);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("6c2dba59-81c2-4d06-a476-66c7cf930a50"),
                column: "Type",
                value: 90);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("6e378e33-7c14-41d8-9005-3211ac337ada"),
                column: "Type",
                value: 20);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("79d4ef1a-8a4a-4cb2-b63a-2307698de15b"),
                column: "Type",
                value: 110);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("7c918f93-79b3-4f0f-91de-798a888d8ec9"),
                column: "Type",
                value: 80);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("94a13b97-2e03-41df-9c4e-84db8f5a05a1"),
                column: "Type",
                value: 52);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("95a05b7b-e88d-48c1-9e65-0cfc2c4a09f6"),
                column: "Type",
                value: 92);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("9f29376d-dbc5-4a1a-85c3-cd6d0cbac9a6"),
                column: "Type",
                value: 91);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("aa0d8c57-e388-4db4-9746-b6cc4b47fd0d"),
                column: "Type",
                value: 160);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("b3a08f9f-263e-42cc-b02a-85b5c6a5979b"),
                column: "Type",
                value: 26);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("bb144aa6-d452-4c65-8dd8-26e83a343d10"),
                column: "Type",
                value: 1);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("bcfd34b3-d0aa-4a84-a68e-d1c58e0a0f36"),
                column: "Type",
                value: 22);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("c17101a7-c7f5-4cfc-99c4-c9e7bff062e0"),
                column: "Type",
                value: 3);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("d474449e-3045-4418-89c7-5a7599e58033"),
                column: "Type",
                value: 181);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("dc24d312-1e12-455e-b58d-6a5e0e1c5a26"),
                column: "Type",
                value: 2);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("e30aa5ae-2e19-4a5b-a9be-40cc74bb25e4"),
                column: "Type",
                value: 23);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("e47c2949-6cf3-4c2f-b6b0-e252b456cacf"),
                column: "Type",
                value: 51);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("e804d9ec-17e5-4cb1-97fd-d033379b2a1e"),
                column: "Type",
                value: 4);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("f3a9df19-ea7c-4a90-a3ee-238c7f745f5f"),
                column: "Type",
                value: 140);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("f42d1226-3c8a-4690-a9cb-702d81e9d134"),
                column: "Type",
                value: 5);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("f88b5e0f-78ec-40b0-ade6-dc6c0414d6b4"),
                column: "Type",
                value: 81);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("fbcc2933-164c-4f37-a9e7-11868c34dc64"),
                column: "Type",
                value: 21);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PositionType",
                table: "Staffs");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Permissions");

            migrationBuilder.AlterColumn<TimeOnly>(
                name: "StartTime",
                table: "WorkingHours",
                type: "time without time zone",
                nullable: false,
                defaultValue: new TimeOnly(0, 0, 0),
                oldClrType: typeof(TimeOnly),
                oldType: "time without time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<TimeOnly>(
                name: "EndTime",
                table: "WorkingHours",
                type: "time without time zone",
                nullable: false,
                defaultValue: new TimeOnly(0, 0, 0),
                oldClrType: typeof(TimeOnly),
                oldType: "time without time zone",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Permissions",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("1740be12-b8a1-40db-b184-d43fd3f6b0fa"),
                column: "Name",
                value: "FinanceView");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("2264ae2c-73b2-4a8f-8e92-cc38d4cd6b6c"),
                column: "Name",
                value: "TrainingsAttendanceMark");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("274e546f-78b0-4dc2-a7bc-548f5e92f4cc"),
                column: "Name",
                value: "NotificationsManage");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("4a6970f1-ff3e-43fd-9172-c4f3f6c2c4c7"),
                column: "Name",
                value: "AnalyticsView");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("4fd7483a-2436-4c2c-bdd3-275e595dcd1e"),
                column: "Name",
                value: "TrainingsQueueManage");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("66d2b5fd-f0fd-4c29-92d6-e165fce4096f"),
                column: "Name",
                value: "PlayersView");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("6c2dba59-81c2-4d06-a476-66c7cf930a50"),
                column: "Name",
                value: "RolesView");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("6e378e33-7c14-41d8-9005-3211ac337ada"),
                column: "Name",
                value: "TrainingsView");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("79d4ef1a-8a4a-4cb2-b63a-2307698de15b"),
                column: "Name",
                value: "NotificationsView");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("7c918f93-79b3-4f0f-91de-798a888d8ec9"),
                column: "Name",
                value: "StaffView");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("94a13b97-2e03-41df-9c4e-84db8f5a05a1"),
                column: "Name",
                value: "PlayersBalanceManage");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("95a05b7b-e88d-48c1-9e65-0cfc2c4a09f6"),
                column: "Name",
                value: "RolePermissionsAssign");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("9f29376d-dbc5-4a1a-85c3-cd6d0cbac9a6"),
                column: "Name",
                value: "RolesManage");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("aa0d8c57-e388-4db4-9746-b6cc4b47fd0d"),
                column: "Name",
                value: "LogsView");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("b3a08f9f-263e-42cc-b02a-85b5c6a5979b"),
                column: "Name",
                value: "TrainingsLevelOverride");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("bb144aa6-d452-4c65-8dd8-26e83a343d10"),
                column: "Name",
                value: "ClubView");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("bcfd34b3-d0aa-4a84-a68e-d1c58e0a0f36"),
                column: "Name",
                value: "TrainingsRegisterPlayer");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("c17101a7-c7f5-4cfc-99c4-c9e7bff062e0"),
                column: "Name",
                value: "LocationsView");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("d474449e-3045-4418-89c7-5a7599e58033"),
                column: "Name",
                value: "FinanceManage");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("dc24d312-1e12-455e-b58d-6a5e0e1c5a26"),
                column: "Name",
                value: "ClubSettingsManage");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("e30aa5ae-2e19-4a5b-a9be-40cc74bb25e4"),
                column: "Name",
                value: "TrainingsCancelPlayer");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("e47c2949-6cf3-4c2f-b6b0-e252b456cacf"),
                column: "Name",
                value: "PlayersManage");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("e804d9ec-17e5-4cb1-97fd-d033379b2a1e"),
                column: "Name",
                value: "LocationsManage");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("f3a9df19-ea7c-4a90-a3ee-238c7f745f5f"),
                column: "Name",
                value: "MediaManage");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("f42d1226-3c8a-4690-a9cb-702d81e9d134"),
                column: "Name",
                value: "CourtsManage");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("f88b5e0f-78ec-40b0-ade6-dc6c0414d6b4"),
                column: "Name",
                value: "StaffManage");

            migrationBuilder.UpdateData(
                table: "Permissions",
                keyColumn: "Id",
                keyValue: new Guid("fbcc2933-164c-4f37-a9e7-11868c34dc64"),
                column: "Name",
                value: "TrainingsManage");
        }
    }
}
