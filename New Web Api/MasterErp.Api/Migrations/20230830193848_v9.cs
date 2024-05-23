using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MasterErp.Api.Migrations

{
    /// <inheritdoc />
    public partial class v9 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Codigo",
                table: "Materiais",
                newName: "CodigoInterno");

            migrationBuilder.AddColumn<string>(
                name: "CodigoFabricante",
                table: "Materiais",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CodigoFabricante",
                table: "Materiais");

            migrationBuilder.RenameColumn(
                name: "CodigoInterno",
                table: "Materiais",
                newName: "Codigo");
        }
    }
}
