using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizAI.Migrations
{
    /// <inheritdoc />
    public partial class added_quiz_removed_completed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Quizzes_IsActive",
                table: "Quizzes");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Quizzes");

            migrationBuilder.CreateTable(
                name: "LikeQuizzes",
                columns: table => new
                {
                    QuizId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    UserId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ApplicationUserId = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    QuizId1 = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LikeQuizzes", x => new { x.QuizId, x.UserId });
                    table.ForeignKey(
                        name: "FK_LikeQuizzes_AspNetUsers_ApplicationUserId",
                        column: x => x.ApplicationUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_LikeQuizzes_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LikeQuizzes_Quizzes_QuizId",
                        column: x => x.QuizId,
                        principalTable: "Quizzes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LikeQuizzes_Quizzes_QuizId1",
                        column: x => x.QuizId1,
                        principalTable: "Quizzes",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_LikeQuizzes_ApplicationUserId",
                table: "LikeQuizzes",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_LikeQuizzes_QuizId1",
                table: "LikeQuizzes",
                column: "QuizId1");

            migrationBuilder.CreateIndex(
                name: "IX_LikeQuizzes_UserId",
                table: "LikeQuizzes",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LikeQuizzes");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Quizzes",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Quizzes_IsActive",
                table: "Quizzes",
                column: "IsActive");
        }
    }
}
