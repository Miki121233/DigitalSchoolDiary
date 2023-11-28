using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class EventStartTimeToStartHoursFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StartTime",
                table: "Events",
                newName: "StartHours");

            migrationBuilder.RenameColumn(
                name: "EndTime",
                table: "Events",
                newName: "EndHours");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StartHours",
                table: "Events",
                newName: "StartTime");

            migrationBuilder.RenameColumn(
                name: "EndHours",
                table: "Events",
                newName: "EndTime");
        }
    }
}
