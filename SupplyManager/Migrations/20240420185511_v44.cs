using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SupplyManager.Migrations
{
    /// <inheritdoc />
    public partial class v44 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UrlsFotos",
                table: "AtividadesRd");

            migrationBuilder.AlterColumn<bool>(
                name: "isActive",
                table: "Usuários",
                type: "tinyint(1)",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "tinyint(1)");

            migrationBuilder.AlterColumn<string>(
                name: "Cargo",
                table: "Usuários",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "RelatorioRdId",
                table: "AtividadesRd",
                type: "int",
                nullable: true);

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

            migrationBuilder.AddForeignKey(
                name: "FK_AtividadesRd_RelatorioDiarios_RelatorioRdId",
                table: "AtividadesRd",
                column: "RelatorioRdId",
                principalTable: "RelatorioDiarios",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AtividadesRd_RelatorioDiarios_RelatorioRdId",
                table: "AtividadesRd");

            migrationBuilder.DropTable(
                name: "ImagensAtividadeRd");

            migrationBuilder.DropIndex(
                name: "IX_AtividadesRd_RelatorioRdId",
                table: "AtividadesRd");

            migrationBuilder.DropColumn(
                name: "RelatorioRdId",
                table: "AtividadesRd");

            migrationBuilder.AlterColumn<bool>(
                name: "isActive",
                table: "Usuários",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "tinyint(1)",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Usuários",
                keyColumn: "Cargo",
                keyValue: null,
                column: "Cargo",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "Cargo",
                table: "Usuários",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "UrlsFotos",
                table: "AtividadesRd",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
