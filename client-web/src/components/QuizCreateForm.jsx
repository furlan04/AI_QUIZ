// src/components/QuizCreateForm.jsx
import { useState } from "react";
import { createQuiz } from "../services/QuizService";

export default function QuizCreateForm() {
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt");
    if (!token) {
      setMessage("Devi effettuare il login per creare un quiz.");
      return;
    }
    const result = await createQuiz(topic, token);
    if (result.id) {
      setMessage(`Quiz creato con successo: ${result.title}`);
    } else {
      setMessage(result.message || "Errore durante la creazione del quiz");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Crea un nuovo Quiz</h2>
      <form onSubmit={handleCreate} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Argomento</label>
          <input
            type="text"
            className="form-control"
            placeholder="Es. Cibo Italiano"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Genera Quiz</button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
