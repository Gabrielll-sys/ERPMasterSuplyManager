using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SupplyManager.Migrations
{
    /// <inheritdoc />
    public partial class v36 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PrecoTotal",
                table: "Orcamentos",
                newName: "PrecoVendaTotal");

            migrationBuilder.AddColumn<decimal>(
                name: "PrecoVendaComDesconto",
                table: "Orcamentos",
                type: "decimal(65,30)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PrecoVendaComDesconto",
                table: "Orcamentos");

            migrationBuilder.RenameColumn(
                name: "PrecoVendaTotal",
                table: "Orcamentos",
                newName: "PrecoTotal");
        }
    }
}
