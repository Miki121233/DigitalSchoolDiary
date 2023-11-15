using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class GradeHasTeacherIdOnly : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TeacherFirstName",
                table: "Grades");

            migrationBuilder.RenameColumn(
                name: "TeacherLastName",
                table: "Grades",
                newName: "TeacherId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TeacherId",
                table: "Grades",
                newName: "TeacherLastName");

            migrationBuilder.AddColumn<string>(
                name: "TeacherFirstName",
                table: "Grades",
                type: "TEXT",
                nullable: true);
        }
    }
}
