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
                newName: "ResponsaveisExecucao");

            migrationBuilder.RenameColumn(
                name: "Observacao",
                table: "OrdemServicos",
                newName: "Observacoes");

            migrationBuilder.AlterColumn<decimal>(
                name: "PrecoTotalEquipamentosOs",
                table: "OrdemServicos",
                type: "decimal(65,30)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(65,30)");

            migrationBuilder.AddColumn<string>(
                name: "NumeroOs",
                table: "OrdemServicos",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumeroOs",
                table: "OrdemServicos");

            migrationBuilder.RenameColumn(
                name: "ResponsavelAbertura",
                table: "OrdemServicos",
                newName: "ResponsavelExecucao");

            migrationBuilder.RenameColumn(
                name: "ResponsaveisExecucao",
                table: "OrdemServicos",
                newName: "OsBrastorno");

            migrationBuilder.RenameColumn(
                name: "Observacoes",
                table: "OrdemServicos",
                newName: "Observacao");

            migrationBuilder.AlterColumn<decimal>(
                name: "PrecoTotalEquipamentosOs",
                table: "OrdemServicos",
                type: "decimal(65,30)",
                nullable: false,
                defaultValue: 0m,
                oldClrType: typeof(decimal),
                oldType: "decimal(65,30)",
                oldNullable: true);
        }
    }
}
