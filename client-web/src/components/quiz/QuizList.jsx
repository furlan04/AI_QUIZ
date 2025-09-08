import { useEffect, useState } from "react";
import { getMyQuizzes, getQuizzes } from "../../services/QuizService";
import { getAuthToken } from "../../services/CommonService";
import { Link, useParams } from "react-router-dom";

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams();

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      const token = getAuthToken();
      
      if (token) {
        try {
          let quizzesData;
          
          if (userId) {
            quizzesData = await getQuizzes(token, userId);
          } else {
            quizzesData = await getMyQuizzes(token);
          }
          
          setQuizzes(quizzesData);
        } catch (error) {
          console.error("Errore nel caricamento dei quiz:", error);
          setQuizzes([]);
        }
      }
      setLoading(false);
    };

    fetchQuizzes();
  }, [userId]);

  const isMyQuizzes = !userId;
  const pageTitle = isMyQuizzes ? "I miei Quiz" : `Quiz dell'utente`;

  if (loading) {
    return (
      <div className="quiz-list-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Caricamento quiz...</p>
        </div>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="quiz-list-container">
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h2 className="empty-title">{pageTitle}</h2>
          <div className="empty-message">
            {isMyQuizzes 
              ? "Non hai ancora creato nessun quiz. Inizia ora!" 
              : "Questo utente non ha ancora creato nessun quiz."
            }
          </div>
          {isMyQuizzes && (
            <Link to="/quizzes/create" className="btn btn-primary btn-empty">
              <span className="btn-icon">✨</span>
              Crea il tuo primo Quiz
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-list-container">
      {/* Header Section */}
      <div className="quiz-list-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">{pageTitle}</h1>
            <p className="page-subtitle">
              {isMyQuizzes 
                ? "Gestisci e monitora i tuoi quiz creati" 
                : "Esplora i quiz creati da questo utente"
              }
            </p>
          </div>
          {isMyQuizzes && (
            <Link to="/quizzes/create" className="btn btn-primary btn-create">
              <span className="btn-icon">✨</span>
              Crea Nuovo Quiz
            </Link>
          )}
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="quiz-grid">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="quiz-card">
            <div className="quiz-card-header">
              {quiz.isActive !== undefined && (
                <div className={`quiz-status ${quiz.isActive ? 'active' : 'inactive'}`}>
                  <span className="status-icon">
                    {quiz.isActive ? "🟢" : "⚫"}
                  </span>
                  <span className="status-text">
                    {quiz.isActive ? "Attivo" : "Inattivo"}
                  </span>
                </div>
              )}
              <div className="quiz-ai-badge">
                <span>AI</span>
              </div>
            </div>

            <div className="quiz-card-content">
              <h3 className="quiz-title">{quiz.title}</h3>
              <p className="quiz-description">
                {quiz.description || "Nessuna descrizione disponibile"}
              </p>
            </div>

            <div className="quiz-card-actions">
              <Link to={`/quiz/${quiz.id}`} className="btn btn-primary btn-play">
                <span className="btn-icon">🎮</span>
                Gioca Quiz
              </Link>
              
              <div className="quiz-secondary-actions">
                <Link to={`/leaderboard/${quiz.id}`} className="btn btn-outline btn-secondary">
                  <span className="btn-icon">🏆</span>
                  Classifica
                </Link>
                <Link to={`/attempts/${quiz.id}`} className="btn btn-outline btn-secondary">
                  <span className="btn-icon">📊</span>
                  Tentativi
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}