using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SupplyManager.Migrations
{
    /// <inheritdoc />
    public partial class v18 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumeroOs",
                table: "OrdemServicos");

            migrationBuilder.RenameColumn(
                name: "Responsavel",
                table: "OrdemServicos",
                newName: "ResponsavelExecucao");

            migrationBuilder.AddColumn<DateTime>(
                name: "DataAbertura",
                table: "OrdemServicos",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DataFechamento",
                table: "OrdemServicos",
                type: "datetime",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OsBrastorno",
                table: "OrdemServicos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ResponsavelAutorizacao",
                table: "OrdemServicos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Usuario",
                table: "OrdemServicos",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataAbertura",
                table: "OrdemServicos");

            migrationBuilder.DropColumn(
                name: "DataFechamento",
                table: "OrdemServicos");

            migrationBuilder.DropColumn(
                name: "OsBrastorno",
                table: "OrdemServicos");

            migrationBuilder.DropColumn(
                name: "ResponsavelAutorizacao",
                table: "OrdemServicos");

            migrationBuilder.DropColumn(
                name: "Usuario",
                table: "OrdemServicos");

            migrationBuilder.RenameColumn(
                name: "ResponsavelExecucao",
                table: "OrdemServicos",
                newName: "Responsavel");

            migrationBuilder.AddColumn<int>(
                name: "NumeroOs",
                table: "OrdemServicos",
                type: "int",
                nullable: true);
        }
    }
}
