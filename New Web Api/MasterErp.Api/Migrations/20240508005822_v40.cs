using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MasterErp.Api.Migrations;

/// <inheritdoc />
public partial class v40 : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "PerfilUsuario",
            table: "Usuários");

        migrationBuilder.RenameColumn(
            name: "DataCadastro",
            table: "Usuários",
            newName: "DataCadastrado");

        migrationBuilder.AddColumn<string>(
            name: "Cargo",
            table: "Usuários",
            type: "longtext",
            nullable: true)
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.AddColumn<bool>(
            name: "isActive",
            table: "Usuários",
            type: "tinyint(1)",
            nullable: true);

        migrationBuilder.AddColumn<string>(
            name: "UrlImage",
            table: "Materiais",
            type: "longtext",
            nullable: true)
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.CreateTable(
            name: "LogAcoesUsuarios",
            columns: table => new
            {
                Id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                Acao = table.Column<string>(type: "longtext", nullable: true)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                DataAcao = table.Column<DateTime>(type: "datetime", nullable: true),
                Responsavel = table.Column<string>(type: "longtext", nullable: true)
                    .Annotation("MySql:CharSet", "utf8mb4")
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_LogAcoesUsuarios", x => x.Id);
            })
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.CreateTable(
            name: "RelatorioDiarios",
            columns: table => new
            {
                Id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                ResponsavelAbertura = table.Column<string>(type: "longtext", nullable: true)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                ResponsavelFechamento = table.Column<string>(type: "longtext", nullable: true)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                Contato = table.Column<string>(type: "longtext", nullable: true)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                HorarioAbertura = table.Column<DateTime>(type: "datetime", nullable: true),
                DataRD = table.Column<DateTime>(type: "datetime", nullable: true),
                isFinished = table.Column<bool>(type: "tinyint(1)", nullable: true),
                HorarioFechamento = table.Column<DateTime>(type: "datetime", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_RelatorioDiarios", x => x.Id);
            })
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.CreateTable(
            name: "AtividadesRd",
            columns: table => new
            {
                Id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                NumeroAtividade = table.Column<int>(type: "int", nullable: true),
                Descricao = table.Column<string>(type: "longtext", nullable: true)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                Status = table.Column<string>(type: "longtext", nullable: true)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                Observacoes = table.Column<string>(type: "longtext", nullable: true)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                RelatorioRdId = table.Column<int>(type: "int", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_AtividadesRd", x => x.Id);
                table.ForeignKey(
                    name: "FK_AtividadesRd_RelatorioDiarios_RelatorioRdId",
                    column: x => x.RelatorioRdId,
                    principalTable: "RelatorioDiarios",
                    principalColumn: "Id");
            })
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.CreateTable(
            name: "ImagensAtividadeRd",
            columns: table => new
            {
                Id = table.Column<int>(type: "int", nullable: false)
                    .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                UrlImagem = table.Column<string>(type: "longtext", nullable: true)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                Descricao = table.Column<string>(type: "longtext", nullable: true)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                DataAdicao = table.Column<string>(type: "longtext", nullable: true)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                AtividadeRdId = table.Column<int>(type: "int", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_ImagensAtividadeRd", x => x.Id);
                table.ForeignKey(
                    name: "FK_ImagensAtividadeRd_AtividadesRd_AtividadeRdId",
                    column: x => x.AtividadeRdId,
                    principalTable: "AtividadesRd",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            })
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.CreateIndex(
            name: "IX_AtividadesRd_RelatorioRdId",
            table: "AtividadesRd",
            column: "RelatorioRdId");

        migrationBuilder.CreateIndex(
            name: "IX_ImagensAtividadeRd_AtividadeRdId",
            table: "ImagensAtividadeRd",
            column: "AtividadeRdId");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "ImagensAtividadeRd");

        migrationBuilder.DropTable(
            name: "LogAcoesUsuarios");

        migrationBuilder.DropTable(
            name: "AtividadesRd");

        migrationBuilder.DropTable(
            name: "RelatorioDiarios");

        migrationBuilder.DropColumn(
            name: "Cargo",
            table: "Usuários");

        migrationBuilder.DropColumn(
            name: "isActive",
            table: "Usuários");

        migrationBuilder.DropColumn(
            name: "UrlImage",
            table: "Materiais");

        migrationBuilder.RenameColumn(
            name: "DataCadastrado",
            table: "Usuários",
            newName: "DataCadastro");

        migrationBuilder.AddColumn<int>(
            name: "PerfilUsuario",
            table: "Usuários",
            type: "int",
            nullable: true);
    }
}
