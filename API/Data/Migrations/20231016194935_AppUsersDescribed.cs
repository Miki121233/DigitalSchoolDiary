using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AppUsersDescribed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AccountType",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClassId",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Users",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Classes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Year = table.Column<string>(type: "TEXT", nullable: true),
                    ClassId = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Classes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StudentToParent",
                columns: table => new
                {
                    ParentsId = table.Column<int>(type: "INTEGER", nullable: false),
                    StudentChildrenId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentToParent", x => new { x.ParentsId, x.StudentChildrenId });
                    table.ForeignKey(
                        name: "FK_StudentToParent_Users_ParentsId",
                        column: x => x.ParentsId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentToParent_Users_StudentChildrenId",
                        column: x => x.StudentChildrenId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StudentToTeacher",
                columns: table => new
                {
                    StudentsId = table.Column<int>(type: "INTEGER", nullable: false),
                    TeachersId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentToTeacher", x => new { x.StudentsId, x.TeachersId });
                    table.ForeignKey(
                        name: "FK_StudentToTeacher_Users_StudentsId",
                        column: x => x.StudentsId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StudentToTeacher_Users_TeachersId",
                        column: x => x.TeachersId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TeacherToClass",
                columns: table => new
                {
                    ClassesId = table.Column<string>(type: "TEXT", nullable: false),
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
                name: "IX_Users_ClassId",
                table: "Users",
                column: "ClassId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentToParent_StudentChildrenId",
                table: "StudentToParent",
                column: "StudentChildrenId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentToTeacher_TeachersId",
                table: "StudentToTeacher",
                column: "TeachersId");

            migrationBuilder.CreateIndex(
                name: "IX_TeacherToClass_TeachersId",
                table: "TeacherToClass",
                column: "TeachersId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Classes_ClassId",
                table: "Users",
                column: "ClassId",
                principalTable: "Classes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Classes_ClassId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "StudentToParent");

            migrationBuilder.DropTable(
                name: "StudentToTeacher");

            migrationBuilder.DropTable(
                name: "TeacherToClass");

            migrationBuilder.DropTable(
                name: "Classes");

            migrationBuilder.DropIndex(
                name: "IX_Users_ClassId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "AccountType",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ClassId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Users");
        }
    }
}
