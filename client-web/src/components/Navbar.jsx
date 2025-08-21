// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar({ isLoggedIn, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/">Quiz App</Link>
        <div className="ms-auto d-flex gap-2">
          {!isLoggedIn ? (
            <>
              <Link to="/register" className="btn btn-outline-primary">Registrati</Link>
              <Link to="/login" className="btn btn-outline-success">Login</Link>
            </>
          ) : (
            <>
              <Link to="/quizzes" className="btn btn-outline-primary">I miei Quiz</Link>
              <Link to="/quizzes/create" className="btn btn-outline-secondary">Crea Quiz</Link>
              <button onClick={onLogout} className="btn btn-danger">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
