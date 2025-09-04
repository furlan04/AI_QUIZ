// src/components/Navbar.jsx (Versione moderna con icone e design migliorato)
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar({ isLoggedIn, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-gradient-primary shadow-lg">
      <div className="container">
        {/* Brand/Logo */}
        <Link className="navbar-brand d-flex align-items-center fw-bold text-dark" to="/">
          <span className="bg-primary bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center me-2" style={{width: '40px', height: '40px'}}>
            <span className="text-primary fw-bold">Q</span>
          </span>
          <span className="d-none d-sm-inline">AI Quiz Network</span>
          <span className="d-inline d-sm-none">AI Quiz</span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-controls="navbarNav"
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`} id="navbarNav">
          <div className="navbar-nav ms-auto d-flex align-items-center gap-2 gap-lg-3 flex-wrap">
            {!isLoggedIn ? (
              // Non autenticato
              <>
                <Link 
                  to="/register" 
                  className="btn btn-primary btn-sm px-2 px-lg-3 d-flex align-items-center gap-1 gap-lg-2 w-100 w-lg-auto justify-content-center justify-content-lg-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="fw-bold">📝</span>
                  <span className="d-none d-sm-inline">Registrati</span>
                  <span className="d-inline d-sm-none">Reg.</span>
                </Link>
                <Link 
                  to="/login" 
                  className="btn btn-outline-primary btn-sm px-2 px-lg-3 d-flex align-items-center gap-1 gap-lg-2 w-100 w-lg-auto justify-content-center justify-content-lg-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="fw-bold">🔑</span>
                  <span className="d-none d-sm-inline">Accedi</span>
                  <span className="d-inline d-sm-none">Login</span>
                </Link>
              </>
            ) : (
              // Autenticato
              <>
                {/* Quiz Management */}
                <Link 
                  to="/quizzes" 
                  className="btn btn-outline-primary btn-sm px-2 px-lg-3 d-flex align-items-center gap-1 gap-lg-2 w-100 w-lg-auto justify-content-center justify-content-lg-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="fw-bold">📚</span>
                  <span className="d-none d-sm-inline">I Miei Quiz</span>
                  <span className="d-inline d-sm-none">Quiz</span>
                </Link>
                
                <Link 
                  to="/quizzes/create" 
                  className="btn btn-outline-primary btn-sm px-2 px-lg-3 d-flex align-items-center gap-1 gap-lg-2 w-100 w-lg-auto justify-content-center justify-content-lg-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="fw-bold">✨</span>
                  <span className="d-none d-sm-inline">Crea Quiz</span>
                  <span className="d-inline d-sm-none">Crea</span>
                </Link>
                
                {/* Friendships Dropdown */}
                <div className="dropdown position-relative w-100 w-lg-auto">
                  <button 
                    className="btn btn-outline-primary btn-sm px-2 px-lg-3 dropdown-toggle d-flex align-items-center gap-1 gap-lg-2 w-100 w-lg-auto justify-content-center justify-content-lg-start" 
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                  >
                    <span className="fw-bold">👥</span>
                    <span className="d-none d-sm-inline">Amicizie</span>
                    <span className="d-inline d-sm-none">Amici</span>
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
                        onClick={() => {
                          setDropdownOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <span className="fw-bold">📨</span>
                        Gestisci Richieste
                      </Link>
                    </li>
                    <li>
                      <Link 
                        className="dropdown-item d-flex align-items-center gap-2 py-2" 
                        to="/friendship/friends"
                        onClick={() => {
                          setDropdownOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <span className="fw-bold">🤝</span>
                        I Miei Amici
                      </Link>
                    </li>
                  </ul>
                </div>
                
                {/* Logout Button */}
                <button 
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }} 
                  className="btn btn-danger btn-sm px-2 px-lg-3 d-flex align-items-center gap-1 gap-lg-2 w-100 w-lg-auto justify-content-center justify-content-lg-start"
                >
                  <span className="fw-bold">🚪</span>
                  <span className="d-none d-sm-inline">Logout</span>
                  <span className="d-inline d-sm-none">Esci</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}