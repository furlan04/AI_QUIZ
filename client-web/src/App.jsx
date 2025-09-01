// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import QuizList from "./components/QuizList";
import QuizCreateForm from "./components/QuizCreateForm";
import QuizPlay from "./components/QuizPlay";
import Home from "./components/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import FriendshipRequests from "./components/FriendshipRequests";
import FriendsList from "./components/FriendsList";

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
        {/* Rotta home - reindirizza ai quiz se loggato */}
        <Route 
          path="/" 
          element={
            isLoggedIn ? (
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <QuizList />
              </ProtectedRoute>
            ) : (
              <Home />
            )
          } 
        />
        
        {/* Rotte pubbliche - accessibili solo se NON loggati */}
        <Route 
          path="/register" 
          element={
            <PublicRoute isLoggedIn={isLoggedIn}>
              <RegisterForm />
            </PublicRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PublicRoute isLoggedIn={isLoggedIn}>
              <LoginForm setIsLoggedIn={setIsLoggedIn} />
            </PublicRoute>
          } 
        />
        
        {/* Rotte per i quiz */}
        <Route 
          path="/quizzes" 
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <QuizList />
            </ProtectedRoute>
          } 
        />
        {/* Rotta per i quiz di un utente specifico */}
        <Route 
          path="/quizzes/:userId" 
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <QuizList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/quizzes/create" 
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <QuizCreateForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/quiz/:id" 
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <QuizPlay />
            </ProtectedRoute>
          } 
        />
        
        {/* Rotte per la gestione delle amicizie */}
        <Route 
          path="/friendship/requests" 
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <FriendshipRequests />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/friendship/friends" 
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <FriendsList />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>  
  );
}