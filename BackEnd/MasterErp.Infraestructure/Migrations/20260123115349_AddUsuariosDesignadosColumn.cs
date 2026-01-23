using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MasterErp.Infraestructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUsuariosDesignadosColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UsuariosDesignados",
                table: "SolicitacoesServico",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UsuariosDesignados",
                table: "SolicitacoesServico");
        }
    }
}
