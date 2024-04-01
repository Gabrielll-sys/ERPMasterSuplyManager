using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SupplyManager.Migrations
{
    /// <inheritdoc />
    public partial class v40 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PerfilUsuario",
                table: "Usuários");

            migrationBuilder.AddColumn<string>(
                name: "Cargo",
                table: "Usuários",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Cargo",
                table: "Usuários");

            migrationBuilder.AddColumn<int>(
                name: "PerfilUsuario",
                table: "Usuários",
                type: "int",
                nullable: true);
        }
    }
}
