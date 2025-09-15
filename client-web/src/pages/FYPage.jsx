import { useEffect, useState } from "react";
import QuizList from "../components/QuizList";

export default function FYPage() {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buildLocation = () => {
      return `/User/LoadFeed`;
    };
    setLocation(buildLocation());
    setLoading(false);
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

  return (
    <div className="quiz-list-container">
      {/* Header Section */}
      <div className="quiz-list-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">Per te</h1>
          </div>
        </div>
      </div>

      <QuizList location={location}></QuizList>
    </div>
  );
}
