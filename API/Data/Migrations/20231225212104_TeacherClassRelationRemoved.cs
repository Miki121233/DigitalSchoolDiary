using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class TeacherClassRelationRemoved : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Classes_Teacher_ClassId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_Teacher_ClassId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Teacher_ClassId",
                table: "Users");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Teacher_ClassId",
                table: "Users",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Teacher_ClassId",
                table: "Users",
                column: "Teacher_ClassId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Classes_Teacher_ClassId",
                table: "Users",
                column: "Teacher_ClassId",
                principalTable: "Classes",
                principalColumn: "Id");
        }
    }
}
