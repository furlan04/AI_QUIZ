using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using QuizAI.Model;
using System.Reflection.Emit;
using System.Text.Json;

namespace QuizAI.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<QuizAttempt> QuizAttempts { get; set; }
        public DbSet<UserAnswer> UserAnswers { get; set; }
        public DbSet<Friendship> Friendships { get; set; }
        public DbSet<LikeQuiz> LikeQuizzes { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Quiz>(entity =>
            {
                entity.HasKey(q => q.Id);
                entity.Property(q => q.Title).IsRequired().HasMaxLength(200);
                entity.Property(q => q.Description).HasMaxLength(1000);
                // CreatedAt viene settato automaticamente dal codice C#, non dal database
                entity.Property(q => q.CreatedAt).IsRequired();

                // Relazione con ApplicationUser
                entity.HasOne(q => q.User)
                      .WithMany()
                      .HasForeignKey(q => q.UserId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Indici per performance
                entity.HasIndex(q => new { q.UserId, q.CreatedAt });
            });

            // Configurazione Question
            builder.Entity<Question>(entity =>
            {
                entity.HasKey(q => new { q.QuizId, q.Order});
                entity.Property(q => q.Text).IsRequired().HasMaxLength(500);
                entity.Property(q => q.OptionsJson).IsRequired().HasColumnType("json");

                // Relazione con Quiz (cascade delete perché le domande sono generate automaticamente)
                entity.HasOne(q => q.Quiz)
                      .WithMany(quiz => quiz.Questions)
                      .HasForeignKey(q => q.QuizId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Indici per performance
                entity.HasIndex(q => new { q.QuizId, q.Order }).IsUnique();
            });

            // Configurazione QuizAttempt
            builder.Entity<QuizAttempt>(entity =>
            {
                entity.HasKey(qa => qa.Id);
                entity.Property(qa => qa.Percentage).HasPrecision(5, 2);

                // Relazione con Quiz
                entity.HasOne(qa => qa.Quiz)
                      .WithMany(q => q.Attempts)
                      .HasForeignKey(qa => qa.QuizId)
                      .OnDelete(DeleteBehavior.Restrict);

                // Relazione con ApplicationUser
                entity.HasOne(qa => qa.User)
                      .WithMany()
                      .HasForeignKey(qa => qa.UserId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(qa => new { qa.QuizId });
            });

            // Configurazione UserAnswer
            builder.Entity<UserAnswer>(entity =>
            {
                entity.HasKey(ua => ua.Id);

                // Relazione con QuizAttempt (cascade delete)
                entity.HasOne(ua => ua.QuizAttempt)
                      .WithMany(qa => qa.UserAnswers)
                      .HasForeignKey(ua => ua.QuizAttemptId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Relazione con Question
                entity.HasOne(ua => ua.Question)
                      .WithMany(q => q.UserAnswers)
                      .HasForeignKey(ua => new { ua.QuestionQuizId, ua.QuestionOrder })
                      .OnDelete(DeleteBehavior.Cascade);

                // Constraint per evitare risposte duplicate per la stessa domanda nello stesso tentativo
                entity.HasIndex(ua => new { ua.QuizAttemptId, ua.QuestionQuizId, ua.QuestionOrder }).IsUnique();
            });

            builder.Entity<Friendship>()
                .HasKey(f => f.Id);

            builder.Entity<Friendship>()
                .HasIndex(f => new { f.SenderId, f.ReceiverId })
                .IsUnique();

            builder.Entity<Friendship>()
                .HasOne(f => f.SendingUser)
                .WithMany(u => u.SentRequests)
                .HasForeignKey(f => f.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Friendship>()
                .HasOne(f => f.ReceivingUser)
                .WithMany(u => u.ReceivedRequests)
                .HasForeignKey(f => f.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<LikeQuiz>(entity =>
            {
                entity.HasKey(q => new { q.QuizId, q.UserId });
            });
                
        }
    }
}
