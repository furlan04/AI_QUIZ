// src/components/RegisterForm.jsx
import { useState } from "react";
import { register } from "../services/AuthService";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await register(email, password);
    if (result.success) {
      setMessage("Registrazione avvenuta! Controlla la tua email per confermare.");
    } else {
      setMessage(result.message || "Errore durante la registrazione");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-gradient-primary">
      <div className="container" style={{maxWidth: '460px'}}>
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="card-header bg-white border-0 py-4">
            <div className="text-center">
              <div className="display-6 mb-2">📝</div>
              <h2 className="fw-bold mb-1">Crea il tuo account</h2>
              <p className="text-muted mb-0">Unisciti alla community di AI Quiz Network</p>
            </div>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <div className="input-group">
                  <span className="input-group-text">@</span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="es. nome@dominio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-text">Usa un'email valida per confermare il tuo account.</div>
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <span className="input-group-text">🔒</span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Crea una password sicura"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-text">Almeno 8 caratteri, meglio se con numeri e simboli.</div>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Registrati
              </button>

              {message && (
                <div className="alert alert-info text-center mt-3" role="alert">
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
