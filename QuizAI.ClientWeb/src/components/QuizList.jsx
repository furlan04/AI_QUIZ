import { useEffect, useState } from "react";
import { getQuizzesFromLocation } from "../services/QuizService";
import { getAuthToken } from "../services/CommonService";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton"; // Importa il componente LikeButton

export default function QuizList({ location }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      const token = getAuthToken();

      if (token) {
        try {
          const quizzesData = await getQuizzesFromLocation(token, location);
          setQuizzes(quizzesData);
        } catch (error) {
          console.error("Errore nel caricamento dei quiz:", error);
          setQuizzes([]);
        }
      }
      setLoading(false);
    };

    fetchQuizzes();
  }, [location]);

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
          <div className="empty-message">Non ci sono quiz disponibili</div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-list-container">
      {/* Quiz Grid */}
      <div className="quiz-grid">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="quiz-card">
            <div className="quiz-card-header">
              <div className="quiz-ai-badge">
                <span>AI</span>
              </div>

              {/* Like Button */}
              <div className="quiz-like-button">
                <LikeButton postId={quiz.id} />
              </div>
            </div>

            <div className="quiz-card-content">
              <h3 className="quiz-title">{quiz.title}</h3>
              <p className="quiz-description">
                {quiz.description || "Nessuna descrizione disponibile"}
              </p>
            </div>

            <div className="quiz-card-actions">
              <Link
                to={`/quiz/${quiz.id}`}
                className="btn btn-primary btn-play"
              >
                <span className="btn-icon">🎮</span>
                Gioca Quiz
              </Link>

              <Link
                to={`/profile/${quiz.userId}`}
                className="btn btn-primary btn-primary-outline"
              >
                <span className="btn-icon">👤</span>
                Vedi Profilo Creatore
              </Link>

              <div className="quiz-secondary-actions">
                <Link
                  to={`/leaderboard/${quiz.id}`}
                  className="btn btn-outline btn-secondary"
                >
                  <span className="btn-icon">🏆</span>
                  Classifica
                </Link>
                <Link
                  to={`/attempts/${quiz.id}`}
                  className="btn btn-outline btn-secondary"
                >
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
