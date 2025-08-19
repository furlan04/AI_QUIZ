using Microsoft.Extensions.Options;
using server_web.Services.Settings;
using System.Net;
using System.Net.Mail;

namespace server_web.Services.Email
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _emailSettings;

        public EmailService(IOptions<EmailSettings> emailOptions)
        {
            _emailSettings = emailOptions.Value;
        }

        public async Task SendEmailConfirmationAsync(string email, string confirmationLink)
        {
            var subject = "Conferma il tuo account";
            var htmlMessage = $@"
            <h2>Conferma il tuo account</h2>
            <p>Grazie per esserti registrato! Clicca sul link sottostante per confermare il tuo account:</p>
            <p><a href='{confirmationLink}' style='background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Conferma Account</a></p>
            <p>Se non riesci a cliccare sul pulsante, copia e incolla questo link nel tuo browser:</p>
            <p>{confirmationLink}</p>
            <p>Se non hai richiesto questa registrazione, puoi ignorare questa email.</p>";

            await SendEmailAsync(email, subject, htmlMessage);
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            using var client = new SmtpClient(_emailSettings.SmtpServer, int.Parse(_emailSettings.SmtpPort!))
            {
                Credentials = new NetworkCredential(_emailSettings.SmtpUsername, _emailSettings.SmtpPassword),
                EnableSsl = bool.Parse(_emailSettings.EnableSsl ?? "true")
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_emailSettings.FromEmail!, _emailSettings.FromName),
                Subject = subject,
                Body = htmlMessage,
                IsBodyHtml = true
            };

            mailMessage.To.Add(email);

            await client.SendMailAsync(mailMessage);
        }
    }
}
