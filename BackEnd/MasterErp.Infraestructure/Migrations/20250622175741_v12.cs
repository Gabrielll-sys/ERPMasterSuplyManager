using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MasterErp.Infraestructure.Migrations
{
    /// <inheritdoc />
    public partial class v12 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Itens_Materiais_MaterialId",
                table: "Itens");

            migrationBuilder.AlterColumn<int>(
                name: "MaterialId",
                table: "Itens",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "DescricaoNaoCadastrado",
                table: "Itens",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_Itens_Materiais_MaterialId",
                table: "Itens",
                column: "MaterialId",
                principalTable: "Materiais",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Itens_Materiais_MaterialId",
                table: "Itens");

            migrationBuilder.DropColumn(
                name: "DescricaoNaoCadastrado",
                table: "Itens");

            migrationBuilder.AlterColumn<int>(
                name: "MaterialId",
                table: "Itens",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Itens_Materiais_MaterialId",
                table: "Itens",
                column: "MaterialId",
                principalTable: "Materiais",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
