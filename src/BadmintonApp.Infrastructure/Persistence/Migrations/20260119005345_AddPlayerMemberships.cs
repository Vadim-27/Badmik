using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BadmintonApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddPlayerMemberships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StaffClubRoles_Clubs_ClubId",
                table: "StaffClubRoles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StaffClubRoles",
                table: "StaffClubRoles");

            migrationBuilder.DropIndex(
                name: "IX_StaffClubRoles_ClubId",
                table: "StaffClubRoles");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ClubId",
                table: "StaffClubRoles");

            migrationBuilder.DropColumn(
                name: "Level",
                table: "Players");

            migrationBuilder.AddColumn<Guid>(
                name: "ClubId",
                table: "Roles",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "StaffId",
                table: "Roles",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ClubId",
                table: "Players",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_StaffClubRoles",
                table: "StaffClubRoles",
                columns: new[] { "StaffId", "RoleId" });

            migrationBuilder.CreateTable(
                name: "PlayerClubMemberships",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PlayerId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClubId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ValidFrom = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ValidUntil = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    TrainingsLeft = table.Column<int>(type: "integer", nullable: false),
                    TrainingsTotalGranted = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerClubMemberships", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlayerClubMemberships_Clubs_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlayerClubMemberships_Players_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PlayerFavoriteLocation",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PlayerId = table.Column<Guid>(type: "uuid", nullable: false),
                    LocationId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerFavoriteLocation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlayerFavoriteLocation_Locations_LocationId",
                        column: x => x.LocationId,
                        principalTable: "Locations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlayerFavoriteLocation_Players_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PlayerSportProfiles",
                columns: table => new
                {
                    PlayerId = table.Column<Guid>(type: "uuid", nullable: false),
                    Sport = table.Column<int>(type: "integer", nullable: false),
                    Level = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerSportProfiles", x => new { x.PlayerId, x.Sport });
                    table.ForeignKey(
                        name: "FK_PlayerSportProfiles_Players_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PlayerSubscriptions",
                columns: table => new
                {
                    FollowerPlayerId = table.Column<Guid>(type: "uuid", nullable: false),
                    FollowingPlayerId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerSubscriptions", x => new { x.FollowerPlayerId, x.FollowingPlayerId });
                    table.ForeignKey(
                        name: "FK_PlayerSubscriptions_Players_FollowerPlayerId",
                        column: x => x.FollowerPlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlayerSubscriptions_Players_FollowingPlayerId",
                        column: x => x.FollowingPlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("5b0ac8d3-e270-422f-af95-99e8be79e47a"),
                columns: new[] { "ClubId", "StaffId" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("98e5cfcd-cada-486a-96bb-30b6a9a60174"),
                columns: new[] { "ClubId", "StaffId" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Roles",
                keyColumn: "Id",
                keyValue: new Guid("bb074c39-08df-45d9-8e74-5b6a07257883"),
                columns: new[] { "ClubId", "StaffId" },
                values: new object[] { null, null });

            migrationBuilder.CreateIndex(
                name: "IX_Roles_ClubId",
                table: "Roles",
                column: "ClubId");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_StaffId",
                table: "Roles",
                column: "StaffId");

            migrationBuilder.CreateIndex(
                name: "IX_Players_ClubId",
                table: "Players",
                column: "ClubId");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerClubMemberships_ClubId",
                table: "PlayerClubMemberships",
                column: "ClubId");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerClubMemberships_PlayerId",
                table: "PlayerClubMemberships",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerFavoriteLocation_LocationId",
                table: "PlayerFavoriteLocation",
                column: "LocationId");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerFavoriteLocation_PlayerId_LocationId",
                table: "PlayerFavoriteLocation",
                columns: new[] { "PlayerId", "LocationId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlayerSubscriptions_FollowingPlayerId",
                table: "PlayerSubscriptions",
                column: "FollowingPlayerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Players_Clubs_ClubId",
                table: "Players",
                column: "ClubId",
                principalTable: "Clubs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Roles_Clubs_ClubId",
                table: "Roles",
                column: "ClubId",
                principalTable: "Clubs",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Roles_Staffs_StaffId",
                table: "Roles",
                column: "StaffId",
                principalTable: "Staffs",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Players_Clubs_ClubId",
                table: "Players");

            migrationBuilder.DropForeignKey(
                name: "FK_Roles_Clubs_ClubId",
                table: "Roles");

            migrationBuilder.DropForeignKey(
                name: "FK_Roles_Staffs_StaffId",
                table: "Roles");

            migrationBuilder.DropTable(
                name: "PlayerClubMemberships");

            migrationBuilder.DropTable(
                name: "PlayerFavoriteLocation");

            migrationBuilder.DropTable(
                name: "PlayerSportProfiles");

            migrationBuilder.DropTable(
                name: "PlayerSubscriptions");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StaffClubRoles",
                table: "StaffClubRoles");

            migrationBuilder.DropIndex(
                name: "IX_Roles_ClubId",
                table: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_Roles_StaffId",
                table: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_Players_ClubId",
                table: "Players");

            migrationBuilder.DropColumn(
                name: "ClubId",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "StaffId",
                table: "Roles");

            migrationBuilder.DropColumn(
                name: "ClubId",
                table: "Players");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Users",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ClubId",
                table: "StaffClubRoles",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                name: "Level",
                table: "Players",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_StaffClubRoles",
                table: "StaffClubRoles",
                columns: new[] { "StaffId", "RoleId", "ClubId" });

            migrationBuilder.CreateIndex(
                name: "IX_StaffClubRoles_ClubId",
                table: "StaffClubRoles",
                column: "ClubId");

            migrationBuilder.AddForeignKey(
                name: "FK_StaffClubRoles_Clubs_ClubId",
                table: "StaffClubRoles",
                column: "ClubId",
                principalTable: "Clubs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
