import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getQuizById } from "../../services/QuizService";
import { submitQuizAttempt } from "../../services/QuizAttemptService";
import { getAuthToken } from "../../services/CommonService";
import "./QuizPlay.css"; // CSS separato per le animazioni

export default function QuizPlay() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [fade, setFade] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id || id === "undefined") return;

    const fetchQuiz = async () => {
      try {
        const token = getAuthToken();
        const quizData = await getQuizById(id, token);
        setQuiz(quizData);
      } catch (err) {
        console.error("Errore caricamento quiz:", err);
      }
    };

    fetchQuiz();
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

  const submitQuiz = async () => {
    setIsSubmitting(true);
    
    // Prepara i dati per la chiamata API
    const submitData = {
      quizId: id,
      answers: quiz.questions.map((q, index) => ({
        questionQuizId: q.quizId,
        questionOrder: q.order,
        selectedAnswerIndex: answers[index] || 0
      }))
    };

    try {
      const token = getAuthToken();
      const result = await submitQuizAttempt(submitData, token);
      setResult(result);
      setShowResult(true);
    } catch (error) {
      console.error('Errore invio quiz:', error);
      // Fallback al calcolo locale in caso di errore
      const correct = quiz.questions.reduce(
        (acc, q, idx) => (answers[idx] === q.correctAnswerIndex ? acc + 1 : acc),
        0
      );
      setResult({
        score: correct,
        percentage: Math.round((correct / quiz.questions.length) * 100),
        totalQuestions: quiz.questions.length
      });
      setShowResult(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    setFade(false); // avvia fade out
    setTimeout(async () => {
      if (currentIndex + 1 < quiz.questions.length) {
        setCurrentIndex(currentIndex + 1);
        setFade(true); // fade in nuova domanda
      } else {
        // Ultima domanda - invia il quiz
        await submitQuiz();
        setFade(true); // fade in risultato
      }
    }, 300); // durata della transizione
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
    setShowResult(false);
  };

  const isSelected = (i) => answers[currentIndex] === i;

  return (
    <div className="container my-3 my-lg-5">
      <div className={`card shadow-lg p-3 p-lg-4 quiz-card ${fade ? "fade-in" : "fade-out"}`}>
        {!showResult ? (
          <>
            <h3 className="card-title mb-3 h4">{quiz.title}</h3>
            <p className="text-muted mb-3 mb-lg-4">{question.text}</p>

            <div className="list-group mb-3 mb-lg-4">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  className={`list-group-item list-group-item-action ${
                    isSelected(i) ? "border border-3 border-primary bg-light" : ""
                  }`}
                  onClick={() => handleOptionClick(i)}
                  disabled={isSubmitting}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-start">{opt}</span>
                    {isSelected(i) && (
                      <span className="badge bg-primary">Selezionata</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="d-flex justify-content-end">
              <button
                className="btn btn-primary btn-lg w-100 w-lg-auto"
                onClick={handleNext}
                disabled={answers[currentIndex] === undefined || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Invio...
                  </>
                ) : (
                  currentIndex + 1 < quiz.questions.length ? "Prossima domanda" : "Vedi risultato"
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h3 className="h4">Quiz completato!</h3>
            <div className="my-3 my-lg-4">
              <h4 className="text-primary h5">Punteggio: {result.score}/{result.totalQuestions}</h4>
              <p className="lead">Percentuale: {result.percentage}%</p>
            </div>
            <button
              className="btn btn-success btn-lg w-100 w-lg-auto"
              onClick={resetQuiz}
            >
              Riprova
            </button>
          </div>
        )}
      </div>
    </div>
  );
}