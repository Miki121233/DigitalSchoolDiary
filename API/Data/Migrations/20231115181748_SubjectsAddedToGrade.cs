using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class SubjectsAddedToGrade : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Subject",
                table: "Grades");

            migrationBuilder.AddColumn<int>(
                name: "SubjectId",
                table: "Grades",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Grades_SubjectId",
                table: "Grades",
                column: "SubjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_Grades_Subjects_SubjectId",
                table: "Grades",
                column: "SubjectId",
                principalTable: "Subjects",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Grades_Subjects_SubjectId",
                table: "Grades");

            migrationBuilder.DropIndex(
                name: "IX_Grades_SubjectId",
                table: "Grades");

            migrationBuilder.DropColumn(
                name: "SubjectId",
                table: "Grades");

            migrationBuilder.AddColumn<string>(
                name: "Subject",
                table: "Grades",
                type: "TEXT",
                nullable: true);
        }
    }
}
