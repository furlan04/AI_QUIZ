// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import QuizList from "./components/MyQuizList";
import QuizCreateForm from "./components/QuizCreateForm";
import QuizPlay from "./components/QuizPlay";
import Home from "./components/HomePage";
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("jwt"));

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
  };

  return (      
  <Router>
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/quizzes/create" element={<QuizCreateForm />} />
          <Route path="/quiz/:id" element={<QuizPlay />} />
        </Routes>
      </Router>  
      );
}
