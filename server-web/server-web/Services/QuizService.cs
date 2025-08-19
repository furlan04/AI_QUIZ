using Microsoft.Extensions.Options;
using server_web.Model;
using server_web.Services;
using System.Net.Http.Headers;
using System.Text.Json;

public class QuizService : IQuizService
{
    private readonly HttpClient _http;
    private readonly LLMSettings _llmSettings;

    public QuizService(HttpClient http, IOptions<LLMSettings> llmOptions)
    {
        _http = http;
        _llmSettings = llmOptions.Value;
    }

    public async Task<GeneratedQuiz> GenerateQuizAsync(string topic)
    {
        var prompt = $@"
Genera un quiz di 10 domande a risposta multipla sul tema '{topic}'.
Rispondi SOLO in JSON con la seguente struttura:

{{
  ""Title"": ""genera un titolo per il topic di poche parole"",
  ""Description"": ""{topic}"",
  ""Questions"": [
    {{
      ""Order"": numero intero della domanda da 1 a 10,
      ""Text"": ""Domanda 1"",
      ""Options"": [""Opzione A"", ""Opzione B"", ""Opzione C"", ""Opzione D""],
      ""CorrectAnswerIndex"": 1
    }}
  ]
}}";

        var request = new
        {
            model = _llmSettings.Model,
            messages = new object[]
            {
                new { role = "system", content = "Sei un generatore di quiz. Rispondi SOLO in JSON valido." },
                new { role = "user", content = prompt }
            },
            temperature = 0.7
        };

        _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _llmSettings.Key);

        var response = await _http.PostAsJsonAsync(_llmSettings.EndPoint, request);

        response.EnsureSuccessStatusCode();

        var jsonResponse = await response.Content.ReadAsStringAsync();

        using var doc = JsonDocument.Parse(jsonResponse);
        var content = doc.RootElement
                         .GetProperty("choices")[0]
                         .GetProperty("message")
                         .GetProperty("content")
                         .GetString();

        Console.WriteLine(content);

        GeneratedQuiz quiz = JsonSerializer.Deserialize<GeneratedQuiz>(content);

        return quiz!;
    }
}
