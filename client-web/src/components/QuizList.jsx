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
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
        </div>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="container mt-5">
        <h2>{pageTitle}</h2>
        <div className="alert alert-info mt-3">
          {isMyQuizzes 
            ? "Non hai ancora quiz creati." 
            : "Questo utente non ha ancora quiz creati."
          }
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">{pageTitle}</h2>
      <div className="row">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="col-md-6 col-lg-4 mb-4">
            <div
              className="card h-100 shadow-sm"
              style={{ transition: "transform 0.2s, box-shadow 0.2s" }}
            >
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{quiz.title}</h5>
                <p className="card-text text-muted flex-grow-1">{quiz.description}</p>
                {quiz.isActive !== undefined && (
                  <span
                    className={`badge mb-2 ${
                      quiz.isActive ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {quiz.isActive ? "Attivo" : "Inattivo"}
                  </span>
                )}
                <div className="mt-auto d-flex justify-content-between">
                  <Link to={`/quiz/${quiz.id}`} className="btn btn-primary btn-sm">
                    Gioca
                  </Link>
                  {/* Mostra il pulsante classifica solo per i propri quiz */}
                  {isMyQuizzes && (
                    <Link to={`#`} className="btn btn-outline-secondary btn-sm">
                      Vedi classifica
                    </Link>
                  )}
                </div>
              </div>
              <style>
                {`
                  .card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
                  }
                `}
              </style>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}