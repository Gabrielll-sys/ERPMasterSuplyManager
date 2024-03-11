using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SupplyManager.Migrations
{
    /// <inheritdoc />
    public partial class v25 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "TesteNovaColuna",
                table: "Materiais",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TesteNovaColuna",
                table: "Materiais");
        }
    }
}
