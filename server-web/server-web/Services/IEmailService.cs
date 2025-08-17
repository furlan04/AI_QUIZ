namespace server_web.Services
{
    public interface IEmailService
    {
        Task SendEmailConfirmationAsync(string email, string confirmationLink);
        Task SendEmailAsync(string email, string subject, string htmlMessage);
    }
}
