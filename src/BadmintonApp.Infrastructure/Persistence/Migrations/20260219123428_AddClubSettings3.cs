using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BadmintonApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddClubSettings3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PlayerClubMemberships_ClubId_PlayerId",
                table: "PlayerClubMemberships");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerClubMemberships_ClubId_PlayerId",
                table: "PlayerClubMemberships",
                columns: new[] { "ClubId", "PlayerId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PlayerClubMemberships_ClubId_PlayerId",
                table: "PlayerClubMemberships");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerClubMemberships_ClubId_PlayerId",
                table: "PlayerClubMemberships",
                columns: new[] { "ClubId", "PlayerId" },
                unique: true,
                filter: "\"Status\" = 1");
        }
    }
}
