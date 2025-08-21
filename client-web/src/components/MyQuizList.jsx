// src/components/QuizList.jsx
import { useEffect, useState } from "react";
import { getMyQuizzes } from "../services/QuizService";
import { Link } from "react-router-dom";

export default function MyQuizList() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      getMyQuizzes(token).then(setQuizzes);
    }
  }, []);

  if (quizzes.length === 0) {
    return (
      <div className="container mt-5">
        <h2>I miei Quiz</h2>
        <div className="alert alert-info mt-3">Non hai ancora quiz creati.</div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">I miei Quiz</h2>
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
                  <Link to={`/quiz/${quiz.id}`} className="btn btn-primary btn-sm flex">
                    Gioca
                  </Link>
                  <Link to={`#`} className="btn btn-outline-secondary btn-sm">
                    Vedi classifica
                  </Link>
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
