// src/components/QuizCreateForm.jsx
import { useState } from "react";
import { createQuiz } from "../../services/QuizService";
import { getAuthToken } from "../../services/CommonService";

export default function QuizCreateForm() {
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    if (!token) {
      setMessage("Devi effettuare il login per creare un quiz.");
      return;
    }
    setLoading(true);
    const result = await createQuiz(topic, token);
    setLoading(false);
    if (result.success) {
      setMessage(`Quiz creato con successo: ${result.title}`);
      setTopic("");
    } else {
      setMessage(result.message || "Errore durante la creazione del quiz");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-start py-5 min-vh-100 bg-gradient-primary">
      <div className="container" style={{maxWidth: '720px'}}>
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="card-header bg-white border-0 py-4">
            <div className="text-center">
              <div className="display-6 mb-2">✨</div>
              <h2 className="fw-bold mb-1">Crea un nuovo Quiz</h2>
              <p className="text-muted mb-0">Descrivi l'argomento, al resto pensa l'AI</p>
            </div>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleCreate} className="mt-1">
              <div className="mb-3">
                <label className="form-label">Argomento</label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text">🧠</span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Es. Storia Romana, JavaScript avanzato, Cultura Pop..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                  />
                </div>
                <div className="form-text">Suggerimento: sii specifico per risultati migliori.</div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
                {loading ? 'Generazione in corso...' : 'Genera Quiz'}
              </button>
            </form>
            {message && (
              <div className="alert alert-info mt-4" role="alert">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
