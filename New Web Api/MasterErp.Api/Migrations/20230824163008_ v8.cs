using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MasterErp.Api.Migrations

{
    /// <inheritdoc />
    public partial class v8 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Inventarios");

            migrationBuilder.AddColumn<DateTime>(
                name: "DataAlteracao",
                table: "Materiais",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "Estoque",
                table: "Materiais",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "Movimentacao",
                table: "Materiais",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Razao",
                table: "Materiais",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Responsavel",
                table: "Materiais",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<float>(
                name: "SaldoFinal",
                table: "Materiais",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataAlteracao",
                table: "Materiais");

            migrationBuilder.DropColumn(
                name: "Estoque",
                table: "Materiais");

            migrationBuilder.DropColumn(
                name: "Movimentacao",
                table: "Materiais");

            migrationBuilder.DropColumn(
                name: "Razao",
                table: "Materiais");

            migrationBuilder.DropColumn(
                name: "Responsavel",
                table: "Materiais");

            migrationBuilder.DropColumn(
                name: "SaldoFinal",
                table: "Materiais");

            migrationBuilder.CreateTable(
                name: "Inventarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Codigo = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Descricao = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Estoque = table.Column<float>(type: "float", nullable: true),
                    Movimentacao = table.Column<float>(type: "float", nullable: true),
                    Razao = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SaldoFinal = table.Column<float>(type: "float", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inventarios", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
