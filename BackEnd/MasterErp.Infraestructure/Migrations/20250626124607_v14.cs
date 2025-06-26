using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MasterErp.Infraestructure.Migrations
{
    /// <inheritdoc />
    public partial class v14 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "BaixaSolicitada",
                table: "OrdemSeparacoes",
                type: "tinyint(1)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OrdemSeparacaoId",
                table: "Materiais",
                type: "int",
                nullable: true);


            migrationBuilder.CreateIndex(
                name: "IX_Materiais_OrdemSeparacaoId",
                table: "Materiais",
                column: "OrdemSeparacaoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Materiais_OrdemSeparacoes_OrdemSeparacaoId",
                table: "Materiais",
                column: "OrdemSeparacaoId",
                principalTable: "OrdemSeparacoes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Materiais_OrdemSeparacoes_OrdemSeparacaoId",
                table: "Materiais");

            migrationBuilder.DropIndex(
                name: "IX_Materiais_OrdemSeparacaoId",
                table: "Materiais");

            migrationBuilder.DropColumn(
                name: "BaixaSolicitada",
                table: "OrdemSeparacoes");

            migrationBuilder.DropColumn(
                name: "OrdemSeparacaoId",
                table: "Materiais");
        }
    }
}
