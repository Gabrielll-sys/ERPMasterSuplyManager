using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MasterErp.Api.Migrations
{
    /// <inheritdoc />
    public partial class v14 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Item_Materiais_MaterialId",
                table: "Item");

            migrationBuilder.DropForeignKey(
                name: "FK_Item_OrdemServicos_OrdemServicoId",
                table: "Item");

            migrationBuilder.DropForeignKey(
                name: "FK_OrdemServicos_Materiais_MaterialId",
                table: "OrdemServicos");

            migrationBuilder.DropIndex(
                name: "IX_OrdemServicos_MaterialId",
                table: "OrdemServicos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Item",
                table: "Item");

            migrationBuilder.DropColumn(
                name: "MaterialId",
                table: "OrdemServicos");

            migrationBuilder.RenameTable(
                name: "Item",
                newName: "Itens");

            migrationBuilder.RenameIndex(
                name: "IX_Item_OrdemServicoId",
                table: "Itens",
                newName: "IX_Itens_OrdemServicoId");

            migrationBuilder.RenameIndex(
                name: "IX_Item_MaterialId",
                table: "Itens",
                newName: "IX_Itens_MaterialId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Itens",
                table: "Itens",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Itens_Materiais_MaterialId",
                table: "Itens",
                column: "MaterialId",
                principalTable: "Materiais",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Itens_OrdemServicos_OrdemServicoId",
                table: "Itens",
                column: "OrdemServicoId",
                principalTable: "OrdemServicos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Itens_Materiais_MaterialId",
                table: "Itens");

            migrationBuilder.DropForeignKey(
                name: "FK_Itens_OrdemServicos_OrdemServicoId",
                table: "Itens");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Itens",
                table: "Itens");

            migrationBuilder.RenameTable(
                name: "Itens",
                newName: "Item");

            migrationBuilder.RenameIndex(
                name: "IX_Itens_OrdemServicoId",
                table: "Item",
                newName: "IX_Item_OrdemServicoId");

            migrationBuilder.RenameIndex(
                name: "IX_Itens_MaterialId",
                table: "Item",
                newName: "IX_Item_MaterialId");

            migrationBuilder.AddColumn<int>(
                name: "MaterialId",
                table: "OrdemServicos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Item",
                table: "Item",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_OrdemServicos_MaterialId",
                table: "OrdemServicos",
                column: "MaterialId");

            migrationBuilder.AddForeignKey(
                name: "FK_Item_Materiais_MaterialId",
                table: "Item",
                column: "MaterialId",
                principalTable: "Materiais",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Item_OrdemServicos_OrdemServicoId",
                table: "Item",
                column: "OrdemServicoId",
                principalTable: "OrdemServicos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OrdemServicos_Materiais_MaterialId",
                table: "OrdemServicos",
                column: "MaterialId",
                principalTable: "Materiais",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
