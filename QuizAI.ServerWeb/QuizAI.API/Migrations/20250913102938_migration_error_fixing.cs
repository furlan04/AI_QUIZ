using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuizAI.Migrations
{
    /// <inheritdoc />
    public partial class migration_error_fixing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LikeQuizzes_AspNetUsers_ApplicationUserId",
                table: "LikeQuizzes");

            migrationBuilder.DropForeignKey(
                name: "FK_LikeQuizzes_AspNetUsers_UserId",
                table: "LikeQuizzes");

            migrationBuilder.DropForeignKey(
                name: "FK_LikeQuizzes_Quizzes_QuizId",
                table: "LikeQuizzes");

            migrationBuilder.DropForeignKey(
                name: "FK_LikeQuizzes_Quizzes_QuizId1",
                table: "LikeQuizzes");

            migrationBuilder.DropIndex(
                name: "IX_LikeQuizzes_ApplicationUserId",
                table: "LikeQuizzes");

            migrationBuilder.DropIndex(
                name: "IX_LikeQuizzes_QuizId1",
                table: "LikeQuizzes");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "LikeQuizzes");

            migrationBuilder.DropColumn(
                name: "QuizId1",
                table: "LikeQuizzes");

            migrationBuilder.AddForeignKey(
                name: "FK_LikeQuizzes_AspNetUsers_UserId",
                table: "LikeQuizzes",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LikeQuizzes_Quizzes_QuizId",
                table: "LikeQuizzes",
                column: "QuizId",
                principalTable: "Quizzes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LikeQuizzes_AspNetUsers_UserId",
                table: "LikeQuizzes");

            migrationBuilder.DropForeignKey(
                name: "FK_LikeQuizzes_Quizzes_QuizId",
                table: "LikeQuizzes");

            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "LikeQuizzes",
                type: "varchar(255)",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "QuizId1",
                table: "LikeQuizzes",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_LikeQuizzes_ApplicationUserId",
                table: "LikeQuizzes",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_LikeQuizzes_QuizId1",
                table: "LikeQuizzes",
                column: "QuizId1");

            migrationBuilder.AddForeignKey(
                name: "FK_LikeQuizzes_AspNetUsers_ApplicationUserId",
                table: "LikeQuizzes",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_LikeQuizzes_AspNetUsers_UserId",
                table: "LikeQuizzes",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_LikeQuizzes_Quizzes_QuizId",
                table: "LikeQuizzes",
                column: "QuizId",
                principalTable: "Quizzes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_LikeQuizzes_Quizzes_QuizId1",
                table: "LikeQuizzes",
                column: "QuizId1",
                principalTable: "Quizzes",
                principalColumn: "Id");
        }
    }
}
