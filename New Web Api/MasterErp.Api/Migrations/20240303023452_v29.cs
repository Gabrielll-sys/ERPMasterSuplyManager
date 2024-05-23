using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MasterErp.Api.Migrations
{
    /// <inheritdoc />
    public partial class v29 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CPFOrCNPJ",
                table: "Orcamentos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "EmailCliente",
                table: "Orcamentos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Empresa",
                table: "Orcamentos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Endereço",
                table: "Orcamentos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "NomeCliente",
                table: "Orcamentos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Telefone",
                table: "Orcamentos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CPFOrCNPJ",
                table: "Orcamentos");

            migrationBuilder.DropColumn(
                name: "EmailCliente",
                table: "Orcamentos");

            migrationBuilder.DropColumn(
                name: "Empresa",
                table: "Orcamentos");

            migrationBuilder.DropColumn(
                name: "Endereço",
                table: "Orcamentos");

            migrationBuilder.DropColumn(
                name: "NomeCliente",
                table: "Orcamentos");

            migrationBuilder.DropColumn(
                name: "Telefone",
                table: "Orcamentos");
        }
    }
}
