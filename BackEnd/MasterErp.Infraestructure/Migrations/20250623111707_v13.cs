using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MasterErp.Infraestructure.Migrations
{
    /// <inheritdoc />
    public partial class v13 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Itens_OrdemServicos_OrdemServicoId",
                table: "Itens");

            migrationBuilder.DropTable(
                name: "OrdemServicos");

            migrationBuilder.DropColumn(
                name: "ResponsavelMudanca",
                table: "Itens");

            migrationBuilder.RenameColumn(
                name: "ResponsavelAdicao",
                table: "Itens",
                newName: "Responsavel");

            migrationBuilder.RenameColumn(
                name: "OrdemServicoId",
                table: "Itens",
                newName: "OrdemSeparacaoId");

            migrationBuilder.RenameIndex(
                name: "IX_Itens_OrdemServicoId",
                table: "Itens",
                newName: "IX_Itens_OrdemSeparacaoId");

            migrationBuilder.CreateTable(
                name: "OrdemSeparacoes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Descricao = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsAuthorized = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Responsavel = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Observacoes = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DataAutorizacao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataAbertura = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataFechamento = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    PrecoVendaTotalOs = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    PrecoCustoTotalOs = table.Column<decimal>(type: "decimal(65,30)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrdemSeparacoes", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_Itens_OrdemSeparacoes_OrdemSeparacaoId",
                table: "Itens",
                column: "OrdemSeparacaoId",
                principalTable: "OrdemSeparacoes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Itens_OrdemSeparacoes_OrdemSeparacaoId",
                table: "Itens");

            migrationBuilder.DropTable(
                name: "OrdemSeparacoes");

            migrationBuilder.RenameColumn(
                name: "Responsavel",
                table: "Itens",
                newName: "ResponsavelAdicao");

            migrationBuilder.RenameColumn(
                name: "OrdemSeparacaoId",
                table: "Itens",
                newName: "OrdemServicoId");

            migrationBuilder.RenameIndex(
                name: "IX_Itens_OrdemSeparacaoId",
                table: "Itens",
                newName: "IX_Itens_OrdemServicoId");

            migrationBuilder.AddColumn<string>(
                name: "ResponsavelMudanca",
                table: "Itens",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "OrdemServicos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    DataAbertura = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataAutorizacao = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DataFechamento = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Descricao = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsAuthorized = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Observacoes = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PrecoCustoTotalOs = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    PrecoVendaTotalOs = table.Column<decimal>(type: "decimal(65,30)", nullable: true),
                    ResponsaveisExecucao = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ResponsavelAbertura = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ResponsavelAutorizacao = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrdemServicos", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_Itens_OrdemServicos_OrdemServicoId",
                table: "Itens",
                column: "OrdemServicoId",
                principalTable: "OrdemServicos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
