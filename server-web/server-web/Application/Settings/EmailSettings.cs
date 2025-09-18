namespace server_web.Application.Settings
{
    public class EmailSettings
    {
        public string SmtpServer {  get; set; }
        public string SmtpPort { get; set; }
        public string SmtpUsername { get; set; }
        public string SmtpPassword { get; set; }
        public string EnableSsl { get; set; }
        public string FromEmail { get; set; }
        public string FromName { get; set; }

    }
}
