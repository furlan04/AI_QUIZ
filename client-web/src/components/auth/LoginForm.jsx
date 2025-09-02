// src/components/LoginForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/AuthService";

export default function LoginForm({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // reset error
    try {
      const result = await login(email, password);

      if (result.success && result.token) {
        // Salvataggio JWT
        localStorage.setItem("jwt", result.token);
        setToken(result.token);

        // Aggiornamento stato login nel componente padre
        if (setIsLoggedIn) {
          setIsLoggedIn(true);
        }

        // Reindirizza alla lista quiz
        navigate("/quizzes");
      } else {
        setError(result.message || "Errore login");
      }
    } catch (err) {
      console.error(err);
      setError("Errore di connessione al server");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-gradient-primary">
      <div className="container" style={{maxWidth: '460px'}}>
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="card-header bg-white border-0 py-4">
            <div className="text-center">
              <div className="display-6 mb-2">🔑</div>
              <h2 className="fw-bold mb-1">Accedi</h2>
              <p className="text-muted mb-0">Bentornato su AI Quiz Network</p>
            </div>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleLogin}>
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
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <span className="input-group-text">🔒</span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Inserisci la password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Accedi
              </button>

              <div className="text-center mt-3">
                <small className="text-muted">Non hai un account?</small>
                <button type="button" className="btn btn-link p-1" onClick={() => navigate('/register')}>
                  Registrati
                </button>
              </div>

              {token && (
                <div className="alert alert-success mt-3">
                  Login effettuato!
                </div>
              )}

              {error && (
                <div className="alert alert-danger mt-3" role="alert">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
