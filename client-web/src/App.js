// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";

export default function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container">
          <Link className="navbar-brand" to="/">AuthApp</Link>
          <div className="ms-auto">
            <Link to="/register" className="btn btn-outline-primary me-2">Registrati</Link>
            <Link to="/login" className="btn btn-outline-success">Login</Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </Router>
  );
}
