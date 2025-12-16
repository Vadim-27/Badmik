using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BadmintonApp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class IsSystemAdded2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "RolePermissions",
                columns: new[] { "PermissionId", "RoleId" },
                values: new object[,]
                {
                    { new Guid("2264ae2c-73b2-4a8f-8e92-cc38d4cd6b6c"), new Guid("5b0ac8d3-e270-422f-af95-99e8be79e47a") },
                    { new Guid("4fd7483a-2436-4c2c-bdd3-275e595dcd1e"), new Guid("5b0ac8d3-e270-422f-af95-99e8be79e47a") },
                    { new Guid("6e378e33-7c14-41d8-9005-3211ac337ada"), new Guid("5b0ac8d3-e270-422f-af95-99e8be79e47a") },
                    { new Guid("b3a08f9f-263e-42cc-b02a-85b5c6a5979b"), new Guid("5b0ac8d3-e270-422f-af95-99e8be79e47a") },
                    { new Guid("bcfd34b3-d0aa-4a84-a68e-d1c58e0a0f36"), new Guid("5b0ac8d3-e270-422f-af95-99e8be79e47a") },
                    { new Guid("e30aa5ae-2e19-4a5b-a9be-40cc74bb25e4"), new Guid("5b0ac8d3-e270-422f-af95-99e8be79e47a") },
                    { new Guid("fbcc2933-164c-4f37-a9e7-11868c34dc64"), new Guid("5b0ac8d3-e270-422f-af95-99e8be79e47a") }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("2264ae2c-73b2-4a8f-8e92-cc38d4cd6b6c"), new Guid("5b0ac8d3-e270-422f-af95-99e8be79e47a") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("4fd7483a-2436-4c2c-bdd3-275e595dcd1e"), new Guid("5b0ac8d3-e270-422f-af95-99e8be79e47a") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("6e378e33-7c14-41d8-9005-3211ac337ada"), new Guid("5b0ac8d3-e270-422f-af95-99e8be79e47a") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("b3a08f9f-263e-42cc-b02a-85b5c6a5979b"), new Guid("5b0ac8d3-e270-422f-af95-99e8be79e47a") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("bcfd34b3-d0aa-4a84-a68e-d1c58e0a0f36"), new Guid("5b0ac8d3-e270-422f-af95-99e8be79e47a") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("e30aa5ae-2e19-4a5b-a9be-40cc74bb25e4"), new Guid("5b0ac8d3-e270-422f-af95-99e8be79e47a") });

            migrationBuilder.DeleteData(
                table: "RolePermissions",
                keyColumns: new[] { "PermissionId", "RoleId" },
                keyValues: new object[] { new Guid("fbcc2933-164c-4f37-a9e7-11868c34dc64"), new Guid("5b0ac8d3-e270-422f-af95-99e8be79e47a") });
        }
    }
}
