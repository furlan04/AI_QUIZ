// src/components/QuizList.jsx
import { useEffect, useState } from "react";
import { getMyQuizzes, getQuizzes } from "../services/QuizService";
import { Link, useParams } from "react-router-dom";

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useParams(); // Ottiene userId dall'URL se presente

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      const token = localStorage.getItem("jwt");
      
      if (token) {
        try {
          let quizzesData;
          
          if (userId) {
            // Se c'è userId nell'URL, prende i quiz di quell'utente
            quizzesData = await getQuizzes(token, userId);
            console.log(quizzesData);
          } else {
            // Altrimenti prende i quiz dell'utente corrente
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
  }, [userId]); // Dipendenza da userId per ricaricare quando cambia

  const isMyQuizzes = !userId; // Determina se stiamo visualizzando i quiz dell'utente corrente
  const pageTitle = isMyQuizzes ? "I miei Quiz" : `Quiz dell'utente`;

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Caricamento...</span>
          </div>
        </div>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <div className="mb-4">
            <span className="display-1 text-muted">📚</span>
          </div>
          <h2 className="text-muted mb-3">{pageTitle}</h2>
          <div className="alert alert-info d-inline-block">
            {isMyQuizzes 
              ? "Non hai ancora creato nessun quiz. Inizia ora!" 
              : "Questo utente non ha ancora creato nessun quiz."
            }
          </div>
          {isMyQuizzes && (
            <div className="mt-3">
              <Link to="/quizzes/create" className="btn btn-primary btn-lg">
                <span className="me-2">✨</span>
                Crea il tuo primo Quiz
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* Header Section */}
      <div className="row align-items-center mb-5">
        <div className="col-lg-8">
          <h1 className="display-5 fw-bold text-primary mb-2">{pageTitle}</h1>
          <p className="lead text-muted mb-0">
            {isMyQuizzes 
              ? "Gestisci e monitora i tuoi quiz creati" 
              : "Esplora i quiz creati da questo utente"
            }
          </p>
        </div>
        {isMyQuizzes && (
          <div className="col-lg-4 text-lg-end">
            <Link to="/quizzes/create" className="btn btn-primary btn-lg">
              <span className="me-2">✨</span>
              Crea Nuovo Quiz
            </Link>
          </div>
        )}
      </div>

      {/* Quiz Grid */}
      <div className="row g-4">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm quiz-card">
              <div className="card-body d-flex flex-column p-4">
                {/* Quiz Status Badge */}
                {quiz.isActive !== undefined && (
                  <div className="mb-3">
                    <span
                      className={`badge rounded-pill px-3 py-2 ${
                        quiz.isActive ? "bg-success bg-opacity-10 text-success" : "bg-secondary bg-opacity-10 text-secondary"
                      }`}
                    >
                      <span className="me-1">
                        {quiz.isActive ? "🟢" : "⚫"}
                      </span>
                      {quiz.isActive ? "Attivo" : "Inattivo"}
                    </span>
                  </div>
                )}

                {/* Quiz Content */}
                <h5 className="card-title fw-bold mb-3 text-dark">{quiz.title}</h5>
                <p className="card-text text-muted flex-grow-1 mb-4">
                  {quiz.description || "Nessuna descrizione disponibile"}
                </p>

                {/* Action Buttons */}
                <div className="mt-auto d-grid gap-2">
                  <Link to={`/quiz/${quiz.id}`} className="btn btn-primary">
                    <span className="me-2">🎮</span>
                    Gioca Quiz
                  </Link>
                  
                  {/* Accesso a Classifica e Tentativi per tutti gli utenti */}
                  <div className="d-grid gap-2">
                    <Link to={`/leaderboard/${quiz.id}`} className="btn btn-outline-primary">
                      <span className="me-2">🏆</span>
                      Vedi Classifica
                    </Link>
                    <Link to={`/attempts/${quiz.id}`} className="btn btn-outline-info">
                      <span className="me-2">📊</span>
                      I miei Tentativi
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}