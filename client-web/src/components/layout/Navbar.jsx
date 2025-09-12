import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";


export default function Navbar({ isLoggedIn, onLogout }) {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  if (!isLoggedIn) {
    // Public navbar - now using the same style as authenticated
    return (
      <>
        {/* Desktop Navbar */}
        <aside className="sidebar-desktop">
          <div className="sidebar-content">
            {/* Logo */}
            <Link className="sidebar-brand" to="/">
              <div className="brand-logo">
                <span className="brand-icon">🧠</span>
              </div>
              <span className="brand-text">AI Quiz</span>
            </Link>

            {/* Navigation Menu for non-authenticated users */}
            <nav className="sidebar-nav">
              <Link
                to="/"
                className={`nav-item ${isActive("/") ? "active" : ""}`}
              >
                <span className="nav-icon">🏠</span>
                <span className="nav-text">Home</span>
              </Link>

              <Link
                to="/login"
                className={`nav-item ${isActive("/login") ? "active" : ""}`}
              >
                <span className="nav-icon">🔑</span>
                <span className="nav-text">Accedi</span>
              </Link>

              <Link
                to="/register"
                className={`nav-item ${isActive("/register") ? "active" : ""}`}
              >
                <span className="nav-icon">📝</span>
                <span className="nav-text">Registrati</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Mobile Bottom Navigation */}
        <nav className="sidebar-mobile">
          <Link
            to="/"
            className={`mobile-nav-item ${isActive("/") ? "active" : ""}`}
          >
            <span className="mobile-nav-icon">🏠</span>
            <span className="mobile-nav-text">Home</span>
          </Link>

          <Link
            to="/login"
            className={`mobile-nav-item ${isActive("/login") ? "active" : ""}`}
          >
            <span className="mobile-nav-icon">🔑</span>
            <span className="mobile-nav-text">Accedi</span>
          </Link>

          <Link
            to="/register"
            className={`mobile-nav-item ${
              isActive("/register") ? "active" : ""
            }`}
          >
            <span className="mobile-nav-icon">📝</span>
            <span className="mobile-nav-text">Registrati</span>
          </Link>
        </nav>
      </>
    );
  }

  // Instagram-like sidebar for authenticated users - unchanged
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar-desktop">
        <div className="sidebar-content">
          {/* Logo */}
          <Link className="sidebar-brand" to="/">
            <div className="brand-logo">
              <span className="brand-icon">🧠</span>
            </div>
            <span className="brand-text">AI Quiz</span>
          </Link>

          {/* Navigation Menu */}
          <nav className="sidebar-nav">
            <Link
              to="/"
              className={`nav-item ${isActive("/") ? "active" : ""}`}
            >
              <span className="nav-icon">🏠</span>
              <span className="nav-text">Home</span>
            </Link>

            <Link
              to="/quizzes"
              className={`nav-item ${isActive("/quizzes") ? "active" : ""}`}
            >
              <span className="nav-icon">📚</span>
              <span className="nav-text">I Miei Quiz</span>
            </Link>

            <Link
              to="/quizzes/create"
              className={`nav-item ${
                isActive("/quizzes/create") ? "active" : ""
              }`}
            >
              <span className="nav-icon">✨</span>
              <span className="nav-text">Crea Quiz</span>
            </Link>

            <div className="nav-dropdown">
              <button
                className={`nav-item dropdown-toggle ${
                  dropdownOpen ? "active" : ""
                }`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="nav-icon">👥</span>
                <span className="nav-text">Amicizie</span>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link
                    to="/friendship/requests"
                    className="nav-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className="dropdown-icon">📨</span>
                    Richieste
                  </Link>
                  <Link
                    to="/friendship/friends"
                    className="nav-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className="dropdown-icon">🤝</span>
                    Amici
                  </Link>
                </div>
              )}
            </div>

            <button onClick={onLogout} className="nav-item logout-btn">
              <span className="nav-icon">🚪</span>
              <span className="nav-text">Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="sidebar-mobile">
        <Link
          to="/"
          className={`mobile-nav-item ${isActive("/") ? "active" : ""}`}
        >
          <span className="mobile-nav-icon">🏠</span>
          <span className="mobile-nav-text">Home</span>
        </Link>

        <Link
          to="/quizzes"
          className={`mobile-nav-item ${isActive("/quizzes") ? "active" : ""}`}
        >
          <span className="mobile-nav-icon">📚</span>
          <span className="mobile-nav-text">Quiz</span>
        </Link>

        <Link
          to="/quizzes/create"
          className={`mobile-nav-item ${
            isActive("/quizzes/create") ? "active" : ""
          }`}
        >
          <span className="mobile-nav-icon">✨</span>
          <span className="mobile-nav-text">Crea</span>
        </Link>

        <div className="mobile-nav-dropdown">
          <button
            className={`mobile-nav-item ${dropdownOpen ? "active" : ""}`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="mobile-nav-icon">👥</span>
            <span className="mobile-nav-text">Amici</span>
          </button>

          {dropdownOpen && (
            <div className="mobile-dropdown-menu">
              <Link
                to="/friendship/requests"
                className="mobile-dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                📨 Richieste
              </Link>
              <Link
                to="/friendship/friends"
                className="mobile-dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                🤝 Amici
              </Link>
            </div>
          )}
        </div>

        <button onClick={onLogout} className="mobile-nav-item logout-btn">
          <span className="mobile-nav-icon">🚪</span>
          <span className="mobile-nav-text">Esci</span>
        </button>
      </nav>
    </>
  );
}
