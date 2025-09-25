using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BadmintonApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Clubs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    City = table.Column<string>(type: "TEXT", nullable: true),
                    Address = table.Column<string>(type: "TEXT", nullable: true),
                    TotalCourts = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clubs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Logs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Level = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Message = table.Column<string>(type: "TEXT", nullable: true),
                    ExceptionJson = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Logs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Permissions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permissions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Trainings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ClubId = table.Column<Guid>(type: "TEXT", nullable: false),
                    LocationId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Type = table.Column<int>(type: "INTEGER", nullable: false),
                    Date = table.Column<DateTime>(type: "TEXT", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "TEXT", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "TEXT", nullable: false),
                    IsRecurringWeekly = table.Column<bool>(type: "INTEGER", nullable: false),
                    CourtsUsed = table.Column<int>(type: "INTEGER", nullable: false),
                    MaxPlayers = table.Column<int>(type: "INTEGER", nullable: false),
                    TrainerId = table.Column<Guid>(type: "TEXT", nullable: true),
                    AllowedLevels = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trainings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: true),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: true),
                    FirstName = table.Column<string>(type: "TEXT", nullable: true),
                    LastName = table.Column<string>(type: "TEXT", nullable: true),
                    DoB = table.Column<DateTime>(type: "TEXT", nullable: false),
                    IsActive = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Rank = table.Column<string>(type: "TEXT", nullable: true),
                    Level = table.Column<int>(type: "INTEGER", nullable: false),
                    ClubId = table.Column<Guid>(type: "TEXT", nullable: true),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WorkingHours",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ClubId = table.Column<Guid>(type: "TEXT", nullable: false),
                    DayOfWeek = table.Column<int>(type: "INTEGER", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "TEXT", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkingHours", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WorkingHours_Clubs_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RolePermissions",
                columns: table => new
                {
                    RoleId = table.Column<Guid>(type: "TEXT", nullable: false),
                    PermissionId = table.Column<Guid>(type: "TEXT", nullable: false)
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
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    RegisteredAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    TrainingId = table.Column<Guid>(type: "TEXT", nullable: true)
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
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    QueuedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    TrainingId = table.Column<Guid>(type: "TEXT", nullable: true)
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
                name: "UserClubRoles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ClubId = table.Column<Guid>(type: "TEXT", nullable: false),
                    RoleId = table.Column<Guid>(type: "TEXT", nullable: false)
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
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    RoleId = table.Column<Guid>(type: "TEXT", nullable: false)
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

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_PermissionId",
                table: "RolePermissions",
                column: "PermissionId");

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Logs");

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
                name: "Users");

            migrationBuilder.DropTable(
                name: "Clubs");
        }
    }
}
