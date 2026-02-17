using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BadmintonApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddClubSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SportType",
                table: "PlayerClubMemberships",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TrainingType",
                table: "PlayerClubMemberships",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "ClubSettings",
                columns: table => new
                {
                    ClubId = table.Column<Guid>(type: "uuid", nullable: false),
                    BookingOpenBeforeDays = table.Column<TimeSpan>(type: "interval", nullable: false),
                    UnsubscribeAllowBeforeHours = table.Column<TimeSpan>(type: "interval", nullable: false),
                    BookingOpenHour = table.Column<TimeSpan>(type: "interval", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClubSettings", x => x.ClubId);
                    table.ForeignKey(
                        name: "FK_ClubSettings_Clubs_ClubId",
                        column: x => x.ClubId,
                        principalTable: "Clubs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PlayerSubscriptions_FollowerPlayerId",
                table: "PlayerSubscriptions",
                column: "FollowerPlayerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClubSettings");

            migrationBuilder.DropIndex(
                name: "IX_PlayerSubscriptions_FollowerPlayerId",
                table: "PlayerSubscriptions");

            migrationBuilder.DropColumn(
                name: "SportType",
                table: "PlayerClubMemberships");

            migrationBuilder.DropColumn(
                name: "TrainingType",
                table: "PlayerClubMemberships");
        }
    }
}
