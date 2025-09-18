import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getQuizById } from "../services/QuizService";
import { submitQuizAttempt } from "../services/QuizAttemptService";
import { getAuthToken } from "../services/CommonService";

export default function QuizPlayPage() {
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
      <div className="quiz-play-container">
        <div className="error-state">
          <div className="error-icon">❌</div>
          <h2 className="error-title">Errore: ID Quiz non valido</h2>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="quiz-play-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="loading-text">Caricamento quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz.questions || !Array.isArray(quiz.questions)) {
    return (
      <div className="quiz-play-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">Il quiz non contiene domande valide</h2>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentIndex];

  const handleOptionClick = (index) => {
    setAnswers({ ...answers, [currentIndex]: index });
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    
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
    setFade(false);
    setTimeout(async () => {
      if (currentIndex + 1 < quiz.questions.length) {
        setCurrentIndex(currentIndex + 1);
        setFade(true);
      } else {
        await submitQuiz();
        setFade(true);
      }
    }, 300);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setAnswers({});
    setResult(null);
    setShowResult(false);
  };

  const isSelected = (i) => answers[currentIndex] === i;

  return (
    <div className="quiz-play-container">
      <div className={`quiz-play-card ${fade ? "fade-in" : "fade-out"}`}>
        {!showResult ? (
          <>
            {/* Quiz Header */}
            <div className="quiz-header">
              <div className="quiz-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  Domanda {currentIndex + 1} di {quiz.questions.length}
                </span>
              </div>
              <h1 className="quiz-title">{quiz.title}</h1>
            </div>

            {/* Question */}
            <div className="question-container">
              <h2 className="question-text">{question.text}</h2>
            </div>

            {/* Options */}
            <div className="options-container">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  className={`option-button ${isSelected(i) ? 'selected' : ''}`}
                  onClick={() => handleOptionClick(i)}
                  disabled={isSubmitting}
                >
                  <div className="option-content">
                    <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                    <span className="option-text">{opt}</span>
                    {isSelected(i) && (
                      <span className="option-check">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Next Button */}
            <div className="quiz-actions">
              <button
                className="btn btn-primary btn-next"
                onClick={handleNext}
                disabled={answers[currentIndex] === undefined || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    Invio...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">
                      {currentIndex + 1 < quiz.questions.length ? "➡️" : "🏁"}
                    </span>
                    {currentIndex + 1 < quiz.questions.length ? "Prossima domanda" : "Vedi risultato"}
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="result-container">
            <div className="result-header">
              <div className="result-icon">🎉</div>
              <h1 className="result-title">Quiz Completato!</h1>
            </div>
            
            <div className="result-stats">
              <div className="stat-card">
                <div className="stat-value">{result.score}</div>
                <div className="stat-label">Risposte Corrette</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{result.totalQuestions}</div>
                <div className="stat-label">Domande Totali</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{result.percentage}%</div>
                <div className="stat-label">Percentuale</div>
              </div>
            </div>

            <div className="result-message">
              {result.percentage >= 80 ? (
                <p className="success-message">🎯 Eccellente! Hai dimostrato una grande conoscenza!</p>
              ) : result.percentage >= 60 ? (
                <p className="good-message">👍 Buon lavoro! Continua così!</p>
              ) : (
                <p className="encourage-message">💪 Non mollare! Riprova per migliorare!</p>
              )}
            </div>

            <div className="result-actions">
              <button className="btn btn-primary btn-retry" onClick={resetQuiz}>
                <span className="btn-icon">🔄</span>
                Riprova Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}