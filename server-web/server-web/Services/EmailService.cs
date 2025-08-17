using System.Net;
using System.Net.Mail;

namespace server_web.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
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
            var smtpSettings = _configuration.GetSection("EmailSettings");

            using var client = new SmtpClient(smtpSettings["SmtpServer"], int.Parse(smtpSettings["SmtpPort"]!))
            {
                Credentials = new NetworkCredential(smtpSettings["SmtpUsername"], smtpSettings["SmtpPassword"]),
                EnableSsl = bool.Parse(smtpSettings["EnableSsl"] ?? "true")
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(smtpSettings["FromEmail"]!, smtpSettings["FromName"]),
                Subject = subject,
                Body = htmlMessage,
                IsBodyHtml = true
            };

            mailMessage.To.Add(email);

            await client.SendMailAsync(mailMessage);
        }
    }
}
