using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MasterErp.Api.Migrations
{
    /// <inheritdoc />
    public partial class v16 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsAutorizhed",
                table: "OrdemServicos",
                newName: "IsAuthorized");

            migrationBuilder.AddColumn<float>(
                name: "Quantidade",
                table: "Itens",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Quantidade",
                table: "Itens");

            migrationBuilder.RenameColumn(
                name: "IsAuthorized",
                table: "OrdemServicos",
                newName: "IsAutorizhed");
        }
    }
}
