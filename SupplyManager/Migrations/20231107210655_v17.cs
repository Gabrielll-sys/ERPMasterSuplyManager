using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SupplyManager.Migrations
{
    /// <inheritdoc />
    public partial class v17 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "Markup",
                table: "Materiais",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "PrecoCusto",
                table: "Materiais",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "PrecoVenda",
                table: "Materiais",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Markup",
                table: "Materiais");

            migrationBuilder.DropColumn(
                name: "PrecoCusto",
                table: "Materiais");

            migrationBuilder.DropColumn(
                name: "PrecoVenda",
                table: "Materiais");
        }
    }
}
