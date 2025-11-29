using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BadmintonApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ChangeClubStructureAndLocation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Court_Location_LocationId",
                table: "Court");

            migrationBuilder.DropForeignKey(
                name: "FK_Location_Clubs_ClubId",
                table: "Location");

            migrationBuilder.DropForeignKey(
                name: "FK_LocationImage_Location_LocationId",
                table: "LocationImage");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkingHours_Location_LocationId",
                table: "WorkingHours");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LocationImage",
                table: "LocationImage");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Location",
                table: "Location");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Court",
                table: "Court");

            migrationBuilder.RenameTable(
                name: "LocationImage",
                newName: "LocationImages");

            migrationBuilder.RenameTable(
                name: "Location",
                newName: "Locations");

            migrationBuilder.RenameTable(
                name: "Court",
                newName: "Courts");

            migrationBuilder.RenameIndex(
                name: "IX_LocationImage_LocationId",
                table: "LocationImages",
                newName: "IX_LocationImages_LocationId");

            migrationBuilder.RenameIndex(
                name: "IX_Location_ClubId",
                table: "Locations",
                newName: "IX_Locations_ClubId");

            migrationBuilder.RenameIndex(
                name: "IX_Court_LocationId",
                table: "Courts",
                newName: "IX_Courts_LocationId");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "Locations",
                type: "timestamptz",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Locations",
                type: "timestamptz",
                nullable: false,
                defaultValueSql: "timezone('utc', now())",
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LocationImages",
                table: "LocationImages",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Locations",
                table: "Locations",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Courts",
                table: "Courts",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "LocationAmenities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    LocationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Amenity = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LocationAmenities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LocationAmenities_Locations_LocationId",
                        column: x => x.LocationId,
                        principalTable: "Locations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_LocationAmenities_LocationId",
                table: "LocationAmenities",
                column: "LocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Courts_Locations_LocationId",
                table: "Courts",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LocationImages_Locations_LocationId",
                table: "LocationImages",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Locations_Clubs_ClubId",
                table: "Locations",
                column: "ClubId",
                principalTable: "Clubs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WorkingHours_Locations_LocationId",
                table: "WorkingHours",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Courts_Locations_LocationId",
                table: "Courts");

            migrationBuilder.DropForeignKey(
                name: "FK_LocationImages_Locations_LocationId",
                table: "LocationImages");

            migrationBuilder.DropForeignKey(
                name: "FK_Locations_Clubs_ClubId",
                table: "Locations");

            migrationBuilder.DropForeignKey(
                name: "FK_WorkingHours_Locations_LocationId",
                table: "WorkingHours");

            migrationBuilder.DropTable(
                name: "LocationAmenities");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Locations",
                table: "Locations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LocationImages",
                table: "LocationImages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Courts",
                table: "Courts");

            migrationBuilder.RenameTable(
                name: "Locations",
                newName: "Location");

            migrationBuilder.RenameTable(
                name: "LocationImages",
                newName: "LocationImage");

            migrationBuilder.RenameTable(
                name: "Courts",
                newName: "Court");

            migrationBuilder.RenameIndex(
                name: "IX_Locations_ClubId",
                table: "Location",
                newName: "IX_Location_ClubId");

            migrationBuilder.RenameIndex(
                name: "IX_LocationImages_LocationId",
                table: "LocationImage",
                newName: "IX_LocationImage_LocationId");

            migrationBuilder.RenameIndex(
                name: "IX_Courts_LocationId",
                table: "Court",
                newName: "IX_Court_LocationId");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UpdatedAt",
                table: "Location",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamptz");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Location",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamptz",
                oldDefaultValueSql: "timezone('utc', now())");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Location",
                table: "Location",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LocationImage",
                table: "LocationImage",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Court",
                table: "Court",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Court_Location_LocationId",
                table: "Court",
                column: "LocationId",
                principalTable: "Location",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Location_Clubs_ClubId",
                table: "Location",
                column: "ClubId",
                principalTable: "Clubs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LocationImage_Location_LocationId",
                table: "LocationImage",
                column: "LocationId",
                principalTable: "Location",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WorkingHours_Location_LocationId",
                table: "WorkingHours",
                column: "LocationId",
                principalTable: "Location",
                principalColumn: "Id");
        }
    }
}
