namespace server_web.Application.ExternalServices.Email
{
    public interface IEmailService
    {
        Task SendEmailConfirmationAsync(string email, string confirmationLink);
        Task SendEmailAsync(string email, string subject, string htmlMessage);
    }
}
