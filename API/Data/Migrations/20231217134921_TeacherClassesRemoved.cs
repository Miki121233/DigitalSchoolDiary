using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class TeacherClassesRemoved : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TeacherToClass");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateTable(
                name: "TeacherToClass",
                columns: table => new
                {
                    ClassesId = table.Column<int>(type: "INTEGER", nullable: false),
                    TeachersId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeacherToClass", x => new { x.ClassesId, x.TeachersId });
                    table.ForeignKey(
                        name: "FK_TeacherToClass_Classes_ClassesId",
                        column: x => x.ClassesId,
                        principalTable: "Classes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TeacherToClass_Users_TeachersId",
                        column: x => x.TeachersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TeacherToClass_TeachersId",
                table: "TeacherToClass",
                column: "TeachersId");
        }
    }
}
