using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookingSports.Migrations
{
    /// <inheritdoc />
    public partial class CascadeDeleteReviews : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Coaches_CoachId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_SportFacilities_SportFacilityId",
                table: "Reviews");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Coaches_CoachId",
                table: "Reviews",
                column: "CoachId",
                principalTable: "Coaches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_SportFacilities_SportFacilityId",
                table: "Reviews",
                column: "SportFacilityId",
                principalTable: "SportFacilities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Coaches_CoachId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_SportFacilities_SportFacilityId",
                table: "Reviews");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Coaches_CoachId",
                table: "Reviews",
                column: "CoachId",
                principalTable: "Coaches",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_SportFacilities_SportFacilityId",
                table: "Reviews",
                column: "SportFacilityId",
                principalTable: "SportFacilities",
                principalColumn: "Id");
        }
    }
}
