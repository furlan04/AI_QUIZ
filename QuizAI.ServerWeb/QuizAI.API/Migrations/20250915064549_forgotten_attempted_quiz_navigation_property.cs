using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizAI.Migrations
{
    /// <inheritdoc />
    public partial class forgotten_attempted_quiz_navigation_property : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "QuizAttempts",
                type: "varchar(255)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttempts_ApplicationUserId",
                table: "QuizAttempts",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuizAttempts_AspNetUsers_ApplicationUserId",
                table: "QuizAttempts",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuizAttempts_AspNetUsers_ApplicationUserId",
                table: "QuizAttempts");

            migrationBuilder.DropIndex(
                name: "IX_QuizAttempts_ApplicationUserId",
                table: "QuizAttempts");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "QuizAttempts");
        }
    }
}
