// src/components/Navbar.jsx (Versione con Dropdown React)
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ isLoggedIn, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
              
              {/* Dropdown per le amicizie con React */}
              <div className="dropdown position-relative">
                <button 
                  className="btn btn-outline-info dropdown-toggle" 
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                >
                  Amicizie
                </button>
                <ul 
                  className={`dropdown-menu position-absolute ${dropdownOpen ? 'show' : ''}`}
                  style={{ 
                    top: '100%', 
                    left: '0',
                    zIndex: 1000
                  }}
                >
                  <li>
                    <Link 
                      className="dropdown-item" 
                      to="/friendship/requests"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Gestisci Richieste
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className="dropdown-item" 
                      to="/friendship/friends"
                      onClick={() => setDropdownOpen(false)}
                    >
                      I Miei Amici
                    </Link>
                  </li>
                </ul>
              </div>
              
              <button onClick={onLogout} className="btn btn-danger">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}