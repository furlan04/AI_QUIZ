import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./QuizPlay.css"; // CSS separato per le animazioni

export default function QuizPlay() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [fade, setFade] = useState(true); // stato per animazione

  useEffect(() => {
    if (!id || id === "undefined") return;

    const token = localStorage.getItem("jwt");
    fetch(`${process.env.REACT_APP_ENDPOINT}/Quiz/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setQuiz(data))
      .catch((err) => console.error("Errore caricamento quiz:", err));
  }, [id]);

  if (!id || id === "undefined") {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Errore: ID Quiz non valido</h4>
        </div>
      </div>
    );
  }

  if (!quiz) return <div className="container mt-5">Caricamento quiz...</div>;
  if (!quiz.questions || !Array.isArray(quiz.questions))
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">Il quiz non contiene domande valide.</div>
      </div>
    );

  const question = quiz.questions[currentIndex];

  const handleOptionClick = (index) => {
    setAnswers({ ...answers, [currentIndex]: index });
  };

  const handleNext = () => {
    setFade(false); // avvia fade out
    setTimeout(() => {
      if (currentIndex + 1 < quiz.questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        const correct = quiz.questions.reduce(
          (acc, q, idx) => (answers[idx] === q.correctAnswerIndex ? acc + 1 : acc),
          0
        );
        setScore(`${correct} su ${quiz.questions.length}`);
        setShowResult(true);
      }
      setFade(true); // fade in nuova domanda
    }, 300); // durata della transizione
  };

  const isSelected = (i) => answers[currentIndex] === i;

  return (
    <div className="container my-5">
      <div className={`card shadow-lg p-4 quiz-card ${fade ? "fade-in" : "fade-out"}`}>
        {!showResult ? (
          <>
            <h3 className="card-title mb-3">{quiz.title}</h3>
            <p className="text-muted mb-4">{question.text}</p>

            <div className="list-group mb-4">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  className={`list-group-item list-group-item-action ${
                    isSelected(i) ? "border border-3 border-primary bg-light" : ""
                  }`}
                  onClick={() => handleOptionClick(i)}
                >
                  {opt}
                  {isSelected(i) && (
                    <span className="badge bg-primary float-end">Selezionata</span>
                  )}
                </button>
              ))}
            </div>

            <div className="d-flex justify-content-end">
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={answers[currentIndex] === undefined}
              >
                {currentIndex + 1 < quiz.questions.length ? "Prossima domanda" : "Vedi risultato"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h3>Quiz completato!</h3>
            <p className="lead">Punteggio: {score}</p>
            <button
              className="btn btn-success"
              onClick={() => {
                setCurrentIndex(0);
                setAnswers({});
                setScore(null);
                setShowResult(false);
              }}
            >
              Riprova
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
