import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar({ isLoggedIn, onLogout }) {
  const location = useLocation();
  const [friendsDropdownOpen, setFriendsDropdownOpen] = useState(false);
  const [quizDropdownOpen, setQuizDropdownOpen] = useState(false);
  const desktopNavRef = useRef(null);
  const mobileNavRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Effect per chiudere i dropdown quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideDesktop = desktopNavRef.current && desktopNavRef.current.contains(event.target);
      const isClickInsideMobile = mobileNavRef.current && mobileNavRef.current.contains(event.target);
      
      if (!isClickInsideDesktop && !isClickInsideMobile) {
        closeAllDropdowns();
      }
    };

    // Aggiungi l'event listener solo se almeno un dropdown è aperto
    if (quizDropdownOpen || friendsDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup function per rimuovere l'event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [quizDropdownOpen, friendsDropdownOpen]);

  // Funzione per aprire solo un dropdown alla volta
  const toggleQuizDropdown = () => {
    setQuizDropdownOpen(!quizDropdownOpen);
    if (friendsDropdownOpen) {
      setFriendsDropdownOpen(false);
    }
  };

  const toggleFriendsDropdown = () => {
    setFriendsDropdownOpen(!friendsDropdownOpen);
    if (quizDropdownOpen) {
      setQuizDropdownOpen(false);
    }
  };

  const closeAllDropdowns = () => {
    setQuizDropdownOpen(false);
    setFriendsDropdownOpen(false);
  };

  if (!isLoggedIn) {
    // Public navbar - unchanged
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

  // Authenticated navbar with fixed dropdowns
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar-desktop" ref={desktopNavRef}>
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
              <span className="nav-text">Per te</span>
            </Link>

            {/* Quiz Dropdown */}
            <div className="nav-dropdown">
              <button
                className={`nav-item dropdown-toggle ${
                  quizDropdownOpen ? "active" : ""
                }`}
                onClick={toggleQuizDropdown}
              >
                <span className="nav-icon">📚</span>
                <span className="nav-text">Quiz</span>
              </button>

              {quizDropdownOpen && (
                <div className="dropdown-menu">
                  <Link
                    to="/quizzes"
                    className="nav-item"
                    onClick={closeAllDropdowns}
                  >
                    I miei Quiz
                  </Link>
                  <Link
                    to="/attempted-quizzes"
                    className="nav-item"
                    onClick={closeAllDropdowns}
                  >
                    Quiz Provati
                  </Link>
                  <Link
                    to="/liked-quizzes"
                    className="nav-item"
                    onClick={closeAllDropdowns}
                  >
                    Quiz Piaciuti
                  </Link>
                  <Link
                    to="/quizzes/create"
                    className="nav-item"
                    onClick={closeAllDropdowns}
                  >
                    <span className="nav-icon">✨</span>
                    Crea quiz
                  </Link>
                </div>
              )}
            </div>

            {/* Friends Dropdown */}
            <div className="nav-dropdown">
              <button
                className={`nav-item dropdown-toggle ${
                  friendsDropdownOpen ? "active" : ""
                }`}
                onClick={toggleFriendsDropdown}
              >
                <span className="nav-icon">👥</span>
                <span className="nav-text">Amicizie</span>
              </button>

              {friendsDropdownOpen && (
                <div className="dropdown-menu">
                  <Link
                    to="/friendship/requests"
                    className="nav-item"
                    onClick={closeAllDropdowns}
                  >
                    <span className="dropdown-icon">📨</span>
                    Richieste
                  </Link>
                  <Link
                    to="/friendship/friends"
                    className="nav-item"
                    onClick={closeAllDropdowns}
                  >
                    <span className="dropdown-icon">🤝</span>
                    Amici
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/settings"
              className="nav-item"
            >
              <span className="nav-icon">🛠️</span>
              <span className="nav-text">Impostazioni</span>
            </Link>

            <button onClick={onLogout} className="nav-item logout-btn">
              <span className="nav-icon">🚪</span>
              <span className="nav-text">Logout</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="sidebar-mobile" ref={mobileNavRef}>
        <Link
          to="/"
          className={`mobile-nav-item ${isActive("/") ? "active" : ""}`}
        >
          <span className="mobile-nav-icon">🏠</span>
          <span className="mobile-nav-text">Per te</span>
        </Link>

        {/* Mobile Quiz Dropdown */}
        <div className="mobile-nav-dropdown">
          <button
            className={`mobile-nav-item ${quizDropdownOpen ? "active" : ""}`}
            onClick={toggleQuizDropdown}
          >
            <span className="mobile-nav-icon">📚</span>
            <span className="mobile-nav-text">Quiz</span>
          </button>

          {quizDropdownOpen && (
            <div className="mobile-dropdown-menu">
              <Link
                to="/quizzes"
                className="mobile-dropdown-item"
                onClick={closeAllDropdowns}
              >
                I miei Quiz
              </Link>
              <Link
                to="/attempted-quizzes"
                className="mobile-dropdown-item"
                onClick={closeAllDropdowns}
              >
                Quiz provati
              </Link>
              <Link
                to="/liked-quizzes"
                className="mobile-dropdown-item"
                onClick={closeAllDropdowns}
              >
                Quiz piaciuti
              </Link>
              <Link
                to="/quizzes/create"
                className="mobile-dropdown-item"
                onClick={closeAllDropdowns}
              >
                Crea quiz
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Friends Dropdown */}
        <div className="mobile-nav-dropdown">
          <button
            className={`mobile-nav-item ${friendsDropdownOpen ? "active" : ""}`}
            onClick={toggleFriendsDropdown}
          >
            <span className="mobile-nav-icon">👥</span>
            <span className="mobile-nav-text">Amici</span>
          </button>

          {friendsDropdownOpen && (
            <div className="mobile-dropdown-menu">
              <Link
                to="/friendship/requests"
                className="mobile-dropdown-item"
                onClick={closeAllDropdowns}
              >
                📨 Richieste
              </Link>
              <Link
                to="/friendship/friends"
                className="mobile-dropdown-item"
                onClick={closeAllDropdowns}
              >
                🤝 Amici
              </Link>
            </div>
          )}
        </div>

        <Link
          to="/settings"
          className="mobile-nav-item"
        >
          <span className="mobile-nav-icon">🛠️</span>
          <span className="mobile-nav-text">Impostazioni</span>
        </Link>

        <button onClick={onLogout} className="mobile-nav-item logout-btn">
          <span className="mobile-nav-icon">🚪</span>
          <span className="mobile-nav-text">Esci</span>
        </button>
      </nav>
    </>
  );
}