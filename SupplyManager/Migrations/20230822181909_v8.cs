using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SupplyManager.Migrations
{
    /// <inheritdoc />
    public partial class v8 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Codigo",
                table: "Inventarios",
                newName: "Responsavel");

            migrationBuilder.AddColumn<DateTime>(
                name: "DataAlteracao",
                table: "Inventarios",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataAlteracao",
                table: "Inventarios");

            migrationBuilder.RenameColumn(
                name: "Responsavel",
                table: "Inventarios",
                newName: "Codigo");
        }
    }
}
