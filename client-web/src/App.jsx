// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { isAuthenticated, logout } from "./services";
import {
  Navbar,
  RegisterForm,
  LoginForm,
  QuizList,
  QuizCreateForm,
  QuizPlay,
  HomePage,
  ProtectedRoute,
  PublicRoute,
  FriendshipRequests,
  FriendsList,
  Leaderboard,
  QuizAttempts,
  QuizReview
} from "./components";
import "./styles/App.css";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  return (      
    <Router>
      <div className={`app-container ${isLoggedIn ? 'authenticated' : 'public'}`}>
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <main className="main-content">
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
              <HomePage />
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
        
        {/* Rotta per la classifica del quiz */}
        <Route 
          path="/leaderboard/:quizId" 
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Leaderboard />
            </ProtectedRoute>
          } 
        />

        {/* Rotta per i tentativi del quiz */}
        <Route 
          path="/attempts/:quizId" 
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <QuizAttempts />
            </ProtectedRoute>
          } 
        />

        {/* Rotta per la revisione di un tentativo */}
        <Route 
          path="/review/:attemptId" 
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <QuizReview />
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
        </main>
      </div>
    </Router>  
  );
}