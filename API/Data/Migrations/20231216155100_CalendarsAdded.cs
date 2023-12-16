using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class CalendarsAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CalendarId",
                table: "Events",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Calendars",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Calendars", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Events_CalendarId",
                table: "Events",
                column: "CalendarId");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Calendars_CalendarId",
                table: "Events",
                column: "CalendarId",
                principalTable: "Calendars",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_Calendars_CalendarId",
                table: "Events");

            migrationBuilder.DropTable(
                name: "Calendars");

            migrationBuilder.DropIndex(
                name: "IX_Events_CalendarId",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "CalendarId",
                table: "Events");
        }
    }
}
