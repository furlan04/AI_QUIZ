// src/components/LoginForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";


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
      const res = await fetch(process.env.REACT_APP_ENDPOINT + "/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // Salvataggio JWT
        localStorage.setItem("jwt", data.token);
        setToken(data.token);

        // Aggiornamento stato login nel componente padre
        if (setIsLoggedIn) {
          setIsLoggedIn(true);
          window.location.reload(true);
        }

        // Reindirizza alla lista quiz
        navigate("/quizzes");
      } else {
        setError(data.message || "Errore login");
      }
    } catch (err) {
      console.error(err);
      setError("Errore di connessione al server");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <form
        onSubmit={handleLogin}
        className="p-4 rounded shadow-lg bg-white"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 className="text-center mb-4">Login</h2>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Inserisci la tua email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Inserisci la password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100">
          Accedi
        </button>

        {token && (
          <div className="alert alert-success mt-3">
            Login effettuato! <br />
            <strong>JWT:</strong> {token}
          </div>
        )}

        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
