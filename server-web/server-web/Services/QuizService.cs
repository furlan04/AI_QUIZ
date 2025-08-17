using server_web.Model;
using server_web.Services;
using System.Net.Http.Headers;
using System.Text.Json;

public class QuizService : IQuizService
{
    private readonly HttpClient _http;
    private readonly IConfiguration _configuration;

    public QuizService(HttpClient http, IConfiguration config)
    {
        _http = http;
        _configuration = config;
    }

    public async Task<Quiz> GenerateQuizAsync(string topic)
    {
        var settings = _configuration.GetSection("LLM");
        var prompt = $@"
Genera un quiz di 10 domande a risposta multipla sul tema '{topic}'.
Rispondi SOLO in JSON con la seguente struttura:

{{
  ""topic"": ""{topic}"",
  ""questions"": [
    {{
      ""order"": numero intero della domanda da 1 a 10,
      ""text"": ""Domanda 1"",
      ""options"": [""Opzione A"", ""Opzione B"", ""Opzione C"", ""Opzione D""],
      ""correctAnswerIndex"": 1
    }}
  ]
}}";

        var request = new
        {
            model = settings["Model"],
            messages = new object[]
            {
                new { role = "system", content = "Sei un generatore di quiz. Rispondi SOLO in JSON valido." },
                new { role = "user", content = prompt }
            },
            temperature = 0.7
        };

        _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", settings["Key"]);

        var response = await _http.PostAsJsonAsync(settings["EndPoint"], request);

        response.EnsureSuccessStatusCode();

        var jsonResponse = await response.Content.ReadAsStringAsync();

        using var doc = JsonDocument.Parse(jsonResponse);
        var content = doc.RootElement
                         .GetProperty("choices")[0]
                         .GetProperty("message")
                         .GetProperty("content")
                         .GetString();

        Console.WriteLine(content);

        // Deserializza il JSON prodotto dal modello in un oggetto Quiz
        var quiz = JsonSerializer.Deserialize<Quiz>(content, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        return quiz!;
    }
}
