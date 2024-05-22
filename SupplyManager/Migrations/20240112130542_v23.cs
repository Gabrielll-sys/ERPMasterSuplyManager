using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MasterErp.Api.Migrations
{
    /// <inheritdoc />
    public partial class v23 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Responsavel",
                table: "Itens",
                newName: "ResponsavelAdicao");

            migrationBuilder.AddColumn<DateTime>(
                name: "DataAlteracaoItem",
                table: "Itens",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ResponsavelMudanca",
                table: "Itens",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataAlteracaoItem",
                table: "Itens");

            migrationBuilder.DropColumn(
                name: "ResponsavelMudanca",
                table: "Itens");

            migrationBuilder.RenameColumn(
                name: "ResponsavelAdicao",
                table: "Itens",
                newName: "Responsavel");
        }
    }
}
