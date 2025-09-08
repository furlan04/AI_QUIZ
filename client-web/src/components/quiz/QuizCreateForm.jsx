import { useState } from "react";
import { createQuiz } from "../../services/QuizService";
import { getAuthToken } from "../../services/CommonService";

export default function QuizCreateForm() {
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // Add this state

  const handleCreate = async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) {
      setMessage("Devi effettuare il login per creare un quiz.");
      setResult({ success: false }); // Set result state
      return;
    }
    setLoading(true);
    const apiResult = await createQuiz(topic, token);
    setResult(apiResult); // Store the result in state
    setLoading(false);
    if (apiResult.success) {
      setMessage(`Quiz creato con successo: ${apiResult.title}`);
      setTopic("");
    } else {
      setMessage(apiResult.message || "Errore durante la creazione del quiz");
    }
  };

  return (
    <div className="quiz-create-container">
      <div className="quiz-create-card">
        <div className="create-header">
          <div className="create-icon">✨</div>
          <h1 className="create-title">Crea un nuovo Quiz</h1>
          <p className="create-subtitle">Descrivi l'argomento, al resto pensa l'AI</p>
        </div>
        
        <div className="create-content">
          <form onSubmit={handleCreate} className="create-form">
            <div className="form-group">
              <label className="form-label">Argomento del Quiz</label>
              <div className="input-container">
                <div className="input-icon">🧠</div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Es. Storia Romana, JavaScript avanzato, Cultura Pop..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
              </div>
              <div className="form-hint">
                💡 Suggerimento: sii specifico per risultati migliori
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary btn-create-quiz" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Generazione in corso...
                </>
              ) : (
                <>
                  <span className="btn-icon">🚀</span>
                  Genera Quiz
                </>
              )}
            </button>
          </form>
          
          {message && (
            <div className={`alert ${result?.success ? 'alert-success' : 'alert-info'}`}>
              <div className="alert-content">
                <span className="alert-icon">
                  {result?.success ? '✅' : 'ℹ️'}
                </span>
                <span className="alert-text">{message}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}