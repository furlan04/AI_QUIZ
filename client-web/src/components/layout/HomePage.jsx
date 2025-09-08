import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        
        <div className="hero-content">
          <div className="container">
            <div className="hero-grid">
              <div className="hero-text">
                <div className="hero-badge">
                  <span className="badge-icon">🚀</span>
                  <span>Nuova Piattaforma AI</span>
                </div>
                
                <h1 className="hero-title">
                  Crea, Condividi e
                  <span className="gradient-text"> Impara</span>
                  <br />
                  con Quiz Intelligenti
                </h1>
                
                <p className="hero-description">
                  La prima piattaforma sociale che combina l'intelligenza artificiale 
                  con l'apprendimento collaborativo. Crea quiz personalizzati, 
                  sfida i tuoi amici e cresci insieme.
                </p>
                
                <div className="hero-actions">
                  <Link to="/register" className="btn btn-primary btn-hero">
                    <span className="btn-icon">✨</span>
                    Inizia Gratis
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-hero">
                    <span className="btn-icon">🔑</span>
                    Accedi
                  </Link>
                </div>
                
                <div className="hero-stats">
                  <div className="stat">
                    <span className="stat-number">10K+</span>
                    <span className="stat-label">Utenti Attivi</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">50K+</span>
                    <span className="stat-label">Quiz Creati</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">1M+</span>
                    <span className="stat-label">Domande AI</span>
                  </div>
                </div>
              </div>
              
              <div className="hero-visual">
                <div className="quiz-preview">
                  <div className="quiz-card-preview">
                    <div className="quiz-header">
                      <div className="quiz-avatar">
                        <span>🧠</span>
                      </div>
                      <div className="quiz-info">
                        <h4>Quiz di Storia</h4>
                        <p>Creato da @mario_rossi</p>
                      </div>
                      <div className="quiz-badge">
                        <span>AI</span>
                      </div>
                    </div>
                    <div className="quiz-question">
                      <p>Chi ha dipinto la Cappella Sistina?</p>
                    </div>
                    <div className="quiz-options">
                      <div className="option">A) Leonardo da Vinci</div>
                      <div className="option correct">B) Michelangelo</div>
                      <div className="option">C) Raffaello</div>
                      <div className="option">D) Botticelli</div>
                    </div>
                  </div>
                  
                  <div className="floating-elements">
                    <div className="floating-icon">📚</div>
                    <div className="floating-icon">🎯</div>
                    <div className="floating-icon">🏆</div>
                    <div className="floating-icon">💡</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Perché Scegliere la Nostra Piattaforma?
            </h2>
            <p className="section-subtitle">
              Esperienza il futuro dell'apprendimento sociale con funzionalità AI all'avanguardia
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <span>🤖</span>
              </div>
              <h3 className="feature-title">Generazione AI</h3>
              <p className="feature-description">
                Crea quiz coinvolgenti istantaneamente con la nostra AI avanzata 
                che si adatta ai tuoi contenuti e genera domande pertinenti.
              </p>
              <div className="feature-highlight">
                <span>+300%</span>
                <span>Velocità di Creazione</span>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <span>👥</span>
              </div>
              <h3 className="feature-title">Apprendimento Sociale</h3>
              <p className="feature-description">
                Connettiti con gli amici, condividi i tuoi quiz e sfida gli altri. 
                Costruisci una community intorno alla conoscenza e alla competizione amichevole.
              </p>
              <div className="feature-highlight">
                <span>95%</span>
                <span>Soddisfazione Utenti</span>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <span>📊</span>
              </div>
              <h3 className="feature-title">Analisi Avanzate</h3>
              <p className="feature-description">
                Monitora i tuoi progressi di apprendimento, traccia le performance 
                nei quiz e scopri aree di miglioramento con analisi dettagliate.
              </p>
              <div className="feature-highlight">
                <span>Real-time</span>
                <span>Feedback</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Come Funziona</h2>
            <p className="section-subtitle">Inizia in soli tre semplici passaggi</p>
          </div>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">
                <span>1</span>
              </div>
              <div className="step-content">
                <h3 className="step-title">Crea il Tuo Account</h3>
                <p className="step-description">
                  Registrati gratuitamente e unisciti alla nostra community 
                  di studenti e creatori.
                </p>
              </div>
              <div className="step-visual">
                <div className="step-icon">👤</div>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">
                <span>2</span>
              </div>
              <div className="step-content">
                <h3 className="step-title">Genera Quiz AI</h3>
                <p className="step-description">
                  Usa la nostra AI per creare quiz coinvolgenti o gioca 
                  con quelli esistenti della community.
                </p>
              </div>
              <div className="step-visual">
                <div className="step-icon">🎯</div>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">
                <span>3</span>
              </div>
              <div className="step-content">
                <h3 className="step-title">Connetti e Condividi</h3>
                <p className="step-description">
                  Condividi i tuoi quiz, sfida gli amici e cresci la tua rete.
                </p>
              </div>
              <div className="step-visual">
                <div className="step-icon">🤝</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Pronto a Iniziare ad Imparare?</h2>
            <p className="cta-description">
              Unisciti a migliaia di utenti che stanno già creando, condividendo 
              e imparando con quiz potenziati dall'AI.
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-cta">
                <span className="btn-icon">🚀</span>
                Crea Account Gratuito
              </Link>
              <Link to="/quizzes" className="btn btn-outline btn-cta">
                <span className="btn-icon">🔍</span>
                Esplora Quiz
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="brand-logo">
                <span className="brand-icon">🧠</span>
              </div>
              <span className="brand-text">AI Quiz</span>
            </div>
            <p className="footer-text">
              © 2024 AI Quiz Social Network. Costruito con React e potenziato dall'AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
