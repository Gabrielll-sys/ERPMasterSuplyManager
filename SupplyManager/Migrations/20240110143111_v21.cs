using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SupplyManager.Migrations
{
    /// <inheritdoc />
    public partial class v21 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PrecoTotalEquipamentosOs",
                table: "OrdemServicos",
                newName: "PrecoVendaTotalOs");

            migrationBuilder.AddColumn<decimal>(
                name: "PrecoCustoTotalOs",
                table: "OrdemServicos",
                type: "decimal(65,30)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PrecoCustoTotalOs",
                table: "OrdemServicos");

            migrationBuilder.RenameColumn(
                name: "PrecoVendaTotalOs",
                table: "OrdemServicos",
                newName: "PrecoTotalEquipamentosOs");
        }
    }
}
