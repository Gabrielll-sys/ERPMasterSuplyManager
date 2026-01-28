using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MasterErp.Infraestructure.Migrations
{
    /// <inheritdoc />
    public partial class AddOptimizationIndices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "NomeCliente",
                table: "Orcamentos",
                type: "varchar(255)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "CpfOrCnpj",
                table: "Orcamentos",
                type: "varchar(255)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Descricao",
                table: "Materiais",
                type: "varchar(255)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "CodigoInterno",
                table: "Materiais",
                type: "varchar(255)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "CodigoFabricante",
                table: "Materiais",
                type: "varchar(255)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Orcamentos_CpfOrCnpj",
                table: "Orcamentos",
                column: "CpfOrCnpj");

            migrationBuilder.CreateIndex(
                name: "IX_Orcamentos_DataOrcamento",
                table: "Orcamentos",
                column: "DataOrcamento");

            migrationBuilder.CreateIndex(
                name: "IX_Orcamentos_NomeCliente",
                table: "Orcamentos",
                column: "NomeCliente");

            migrationBuilder.CreateIndex(
                name: "IX_Materiais_CodigoFabricante",
                table: "Materiais",
                column: "CodigoFabricante");

            migrationBuilder.CreateIndex(
                name: "IX_Materiais_CodigoInterno",
                table: "Materiais",
                column: "CodigoInterno");

            migrationBuilder.CreateIndex(
                name: "IX_Materiais_Descricao",
                table: "Materiais",
                column: "Descricao");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Orcamentos_CpfOrCnpj",
                table: "Orcamentos");

            migrationBuilder.DropIndex(
                name: "IX_Orcamentos_DataOrcamento",
                table: "Orcamentos");

            migrationBuilder.DropIndex(
                name: "IX_Orcamentos_NomeCliente",
                table: "Orcamentos");

            migrationBuilder.DropIndex(
                name: "IX_Materiais_CodigoFabricante",
                table: "Materiais");

            migrationBuilder.DropIndex(
                name: "IX_Materiais_CodigoInterno",
                table: "Materiais");

            migrationBuilder.DropIndex(
                name: "IX_Materiais_Descricao",
                table: "Materiais");

            migrationBuilder.AlterColumn<string>(
                name: "NomeCliente",
                table: "Orcamentos",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "CpfOrCnpj",
                table: "Orcamentos",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Descricao",
                table: "Materiais",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "CodigoInterno",
                table: "Materiais",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "CodigoFabricante",
                table: "Materiais",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
