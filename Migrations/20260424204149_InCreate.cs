using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkillBridge.Migrations
{
    /// <inheritdoc />
    public partial class InCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Services",
                newName: "serviceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "serviceId",
                table: "Services",
                newName: "Id");
        }
    }
}
