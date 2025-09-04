using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using server_web.Model;
using server_web.Model.Dto;
using server_web.Services.Email;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;

namespace server_web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthController(UserManager<ApplicationUser> userManager,
                              SignInManager<ApplicationUser> signInManager,
                              IConfiguration configuration,
                              IEmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _emailService = emailService;
        }

        // POST: api/Auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                // Genera il token di conferma email
                var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                // Crea il link di conferma
                var confirmationLink = Url.Action(
                    "ConfirmEmail",
                    "Auth",
                    new { userId = user.Id, token = emailToken },
                    Request.Scheme);

                // Invia l'email di conferma
                try
                {
                    _ = Task.Run(async () =>
                    {
                        try
                        {
                            await _emailService.SendEmailConfirmationAsync(user.Email, confirmationLink);
                            Console.WriteLine("Email inviata in background");
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Errore invio email in background: {ex.Message}");
                        }
                    });
                    return Ok(new
                    {
                        message = "Utente registrato con successo. Controlla la tua email per confermare l'account.",
                        emailSent = true
                    });
                }
                catch (Exception ex)
                {
                    // Log dell'errore (usa il tuo sistema di logging preferito)
                    // _logger.LogError(ex, "Errore durante l'invio dell'email di conferma");

                    return Ok(new
                    {
                        message = "Utente registrato con successo, ma si è verificato un errore nell'invio dell'email di conferma.",
                        emailSent = false
                    });
                }
            }

            return BadRequest(result.Errors);
        }

        // POST: api/Auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) return Unauthorized("Email o password errati");

            // Verifica se l'email è confermata
            if (!await _userManager.IsEmailConfirmedAsync(user))
            {
                return BadRequest(new
                {
                    message = "Email non confermata. Controlla la tua email e clicca sul link di conferma.",
                    emailNotConfirmed = true
                });
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded) return Unauthorized("Email o password errati");

            // Genera il JWT
            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }

        // GET: api/Auth/confirm-email
        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(token))
            {
                return BadRequest("User ID e token sono richiesti");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return BadRequest("Utente non trovato");
            }

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
            {
                return Ok(new { message = "Email confermata con successo. Ora puoi effettuare il login." });
            }

            return BadRequest("Errore nella conferma dell'email");
        }

        // POST: api/Auth/resend-confirmation-email
        [HttpPost("resend-confirmation-email")]
        public async Task<IActionResult> ResendConfirmationEmail([FromBody] ResendEmailDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                // Per sicurezza, non rivelare se l'email esiste o meno
                return Ok(new { message = "Se l'email esiste nel sistema, ti è stata inviata una nuova email di conferma." });
            }

            if (await _userManager.IsEmailConfirmedAsync(user))
            {
                return BadRequest("L'email è già stata confermata");
            }

            // Genera un nuovo token di conferma
            var emailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            // Crea il link di conferma
            var confirmationLink = Url.Action(
                "ConfirmEmail",
                "Auth",
                new { userId = user.Id, token = emailToken },
                Request.Scheme);

            try
            {
                await _emailService.SendEmailConfirmationAsync(user.Email, confirmationLink);
                return Ok(new { message = "Email di conferma inviata nuovamente." });
            }
            catch (Exception ex)
            {
                // Log dell'errore
                // _logger.LogError(ex, "Errore durante il re-invio dell'email di conferma");

                return StatusCode(500, "Errore durante l'invio dell'email di conferma");
            }
        }

        private string GenerateJwtToken(IdentityUser user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}