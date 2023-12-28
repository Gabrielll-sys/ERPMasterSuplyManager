using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SupplyManager.Migrations
{
    /// <inheritdoc />
    public partial class v19 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ResponsavelExecucao",
                table: "OrdemServicos",
                newName: "ResponsavelAbertura");

            migrationBuilder.RenameColumn(
                name: "OsBrastorno",
                table: "OrdemServicos",
                newName: "NumeroOs");

            migrationBuilder.AddColumn<string>(
                name: "ResponsaveisExecucao",
                table: "OrdemServicos",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ResponsaveisExecucao",
                table: "OrdemServicos");

            migrationBuilder.RenameColumn(
                name: "ResponsavelAbertura",
                table: "OrdemServicos",
                newName: "ResponsavelExecucao");

            migrationBuilder.RenameColumn(
                name: "NumeroOs",
                table: "OrdemServicos",
                newName: "OsBrastorno");
        }
    }
}
