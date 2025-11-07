using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BadmintonApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialPostgres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Clubs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    City = table.Column<string>(type: "text", nullable: true),
                    Address = table.Column<string>(type: "text", nullable: true),
                    TotalCourts = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clubs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Logs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Level = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Message = table.Column<string>(type: "text", nullable: true),
                    ExceptionJson = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Logs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Permissions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permissions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Trainings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ClubId = table.Column<Guid>(type: "uuid", nullable: false),
                    LocationId = table.Column<Guid>(type: "uuid", nullable: true),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    IsRecurringWeekly = table.Column<bool>(type: "boolean", nullable: false),
                    CourtsUsed = table.Column<int>(type: "integer", nullable: false),
                    MaxPlayers = table.Column<int>(type: "integer", nullable: false),
                    TrainerId = table.Column<Guid>(type: "uuid", nullable: true),
                    AllowedLevels = table.Column<int[]>(type: "integer[]", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trainings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: true),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    FirstName = table.Column<string>(type: "text", nullable: true),
                    LastName = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    DoB = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ClubId = table.Column<Guid>(type: "uuid", nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RolePermissions",
                columns: table => new
                {
                    RoleId = table.Column<Guid>(type: "uuid", nullable: false),
                    PermissionId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolePermissions", x => new { x.RoleId, x.PermissionId });
                    table.ForeignKey(
                        name: "FK_RolePermissions_Permissions_PermissionId",
                        column: x => x.PermissionId,
                        principalTable: "Permissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RolePermissions_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrainingParticipants",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    RegisteredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TrainingId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingParticipants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrainingParticipants_Trainings_TrainingId",
                        column: x => x.TrainingId,
                        principalTable: "Trainings",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TrainingQueueEntries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    QueuedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TrainingId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingQueueEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrainingQueueEntries_Trainings_TrainingId",
                        column: x => x.TrainingId,
                        principalTable: "Trainings",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Players",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Level = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Players", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Players_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Staffs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    StaffStatus = table.Column<int>(type: "integer", nullable: false),
                    EmploymentType = table.Column<int>(type: "integer", nullable: false),
                    ClubId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: true),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    SalaryType = table.Column<int>(type: "integer", nullable: false),
                    HourlyRate = table.Column<decimal>(type: "numeric", nullable: false),
                    MonthlySalary = table.Column<decimal>(type: "numeric", nullable: false),
                    Currency = table.Column<string>(type: "text", nullable: true),
                    PerTrainingRate = table.Column<decimal>(type: "numeric", nullable: false),
                    PayrollNotes = table.Column<string>(type: "text", nullable: true),
                    TimeZone = table.Column<string>(type: "text", nullable: true),
                    StatusReason = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Staffs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Staffs_Clubs_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Staffs_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserClubRoles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClubId = table.Column<Guid>(type: "uuid", nullable: false),
                    RoleId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserClubRoles", x => new { x.UserId, x.RoleId, x.ClubId });
                    table.ForeignKey(
                        name: "FK_UserClubRoles_Clubs_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserClubRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserClubRoles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    RoleId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.RoleId, x.UserId });
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WorkingHours",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ClubId = table.Column<Guid>(type: "uuid", nullable: true),
                    StaffId = table.Column<Guid>(type: "uuid", nullable: true),
                    DayOfWeek = table.Column<int>(type: "integer", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkingHours", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WorkingHours_Clubs_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_WorkingHours_Staffs_StaffId",
                        column: x => x.StaffId,
                        principalTable: "Staffs",
                        principalColumn: "Id");
                });

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
                table: "Roles",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("45225223-0e47-4c7a-b045-38de629412e5"), "SuperAdmin" },
                    { new Guid("5b0ac8d3-e270-422f-af95-99e8be79e47a"), "Player" },
                    { new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174"), "ClubAdmin" },
                    { new Guid("bb074c39-08df-45d9-8e74-5b6a07257883"), "ClubManager" }
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

            migrationBuilder.CreateIndex(
                name: "IX_Players_UserId",
                table: "Players",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_PermissionId",
                table: "RolePermissions",
                column: "PermissionId");

            migrationBuilder.CreateIndex(
                name: "IX_Staffs_ClubId",
                table: "Staffs",
                column: "ClubId");

            migrationBuilder.CreateIndex(
                name: "IX_Staffs_UserId",
                table: "Staffs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingParticipants_TrainingId",
                table: "TrainingParticipants",
                column: "TrainingId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingQueueEntries_TrainingId",
                table: "TrainingQueueEntries",
                column: "TrainingId");

            migrationBuilder.CreateIndex(
                name: "IX_UserClubRoles_ClubId",
                table: "UserClubRoles",
                column: "ClubId");

            migrationBuilder.CreateIndex(
                name: "IX_UserClubRoles_RoleId",
                table: "UserClubRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_UserId",
                table: "UserRoles",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkingHours_ClubId",
                table: "WorkingHours",
                column: "ClubId");

            migrationBuilder.CreateIndex(
                name: "IX_WorkingHours_StaffId",
                table: "WorkingHours",
                column: "StaffId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Logs");

            migrationBuilder.DropTable(
                name: "Players");

            migrationBuilder.DropTable(
                name: "RolePermissions");

            migrationBuilder.DropTable(
                name: "TrainingParticipants");

            migrationBuilder.DropTable(
                name: "TrainingQueueEntries");

            migrationBuilder.DropTable(
                name: "UserClubRoles");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "WorkingHours");

            migrationBuilder.DropTable(
                name: "Permissions");

            migrationBuilder.DropTable(
                name: "Trainings");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Staffs");

            migrationBuilder.DropTable(
                name: "Clubs");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
