using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SupplyManager.Migrations
{
    /// <inheritdoc />
    public partial class v48 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Responsavel",
                table: "RelatorioDiarios",
                newName: "ResponsavelFechamento");

            migrationBuilder.AddColumn<DateTime>(
                name: "HorarioFechamento",
                table: "RelatorioDiarios",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ResponsavelAbertura",
                table: "RelatorioDiarios",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HorarioFechamento",
                table: "RelatorioDiarios");

            migrationBuilder.DropColumn(
                name: "ResponsavelAbertura",
                table: "RelatorioDiarios");

            migrationBuilder.RenameColumn(
                name: "ResponsavelFechamento",
                table: "RelatorioDiarios",
                newName: "Responsavel");
        }
    }
}
