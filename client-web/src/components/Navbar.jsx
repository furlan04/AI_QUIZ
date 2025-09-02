// src/components/Navbar.jsx (Versione moderna con icone e design migliorato)
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ isLoggedIn, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-gradient-primary shadow-lg">
      <div className="container">
        {/* Brand/Logo */}
        <Link className="navbar-brand d-flex align-items-center fw-bold fs-3 text-dark" to="/">
          <span className="bg-primary bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center me-2" style={{width: '40px', height: '40px'}}>
            <span className="text-primary fw-bold">Q</span>
          </span>
          AI Quiz Network
        </Link>

        {/* Navigation Links */}
        <div className="navbar-nav ms-auto d-flex align-items-center gap-3">
          {!isLoggedIn ? (
            // Non autenticato
            <>
              <Link to="/register" className="btn btn-primary btn-sm px-3 d-flex align-items-center gap-2">
                <span className="fw-bold">📝</span>
                Registrati
              </Link>
              <Link to="/login" className="btn btn-outline-primary btn-sm px-3 d-flex align-items-center gap-2">
                <span className="fw-bold">🔑</span>
                Accedi
              </Link>
            </>
          ) : (
            // Autenticato
            <>
              {/* Quiz Management */}
              <Link to="/quizzes" className="btn btn-outline-primary btn-sm px-3 d-flex align-items-center gap-2">
                <span className="fw-bold">📚</span>
                I Miei Quiz
              </Link>
              
              <Link to="/quizzes/create" className="btn btn-outline-primary btn-sm px-3 d-flex align-items-center gap-2">
                <span className="fw-bold">✨</span>
                Crea Quiz
              </Link>
              
              {/* Friendships Dropdown */}
              <div className="dropdown position-relative">
                <button 
                  className="btn btn-outline-primary btn-sm px-3 dropdown-toggle d-flex align-items-center gap-2" 
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                >
                  <span className="fw-bold">👥</span>
                  Amicizie
                </button>
                <ul 
                  className={`dropdown-menu dropdown-menu-end shadow-lg border-0 ${dropdownOpen ? 'show' : ''}`}
                  style={{ 
                    top: '100%', 
                    right: '0',
                    zIndex: 1000,
                    minWidth: '200px'
                  }}
                >
                  <li>
                    <Link 
                      className="dropdown-item d-flex align-items-center gap-2 py-2" 
                      to="/friendship/requests"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="fw-bold">📨</span>
                      Gestisci Richieste
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className="dropdown-item d-flex align-items-center gap-2 py-2" 
                      to="/friendship/friends"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="fw-bold">🤝</span>
                      I Miei Amici
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Logout Button */}
              <button 
                onClick={onLogout} 
                className="btn btn-danger btn-sm px-3 d-flex align-items-center gap-2"
              >
                <span className="fw-bold">🚪</span>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}