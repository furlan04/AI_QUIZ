// src/components/index.js
// File di esportazione centralizzato per tutti i componenti

// Componenti di autenticazione
export { default as LoginForm } from './auth/LoginForm';
export { default as RegisterForm } from './auth/RegisterForm';
export { default as ProtectedRoute } from './auth/ProtectedRoute';
export { default as PublicRoute } from './auth/PublicRoute';

// Componenti relativi ai quiz
export { default as QuizList } from './quiz/QuizList';
export { default as QuizCreateForm } from './quiz/QuizCreateForm';
export { default as QuizPlay } from './quiz/QuizPlay';
export { default as QuizReview } from './quiz/QuizReview';
export { default as QuizAttempts } from './quiz/QuizAttempts';
export { default as Leaderboard } from './quiz/Leaderboard';

// Componenti per la gestione amicizie
export { default as FriendsList } from './friendship/FriendsList';
export { default as FriendshipRequests } from './friendship/FriendshipRequests';

// Componenti di layout
export { default as Navbar } from './layout/Navbar';
export { default as HomePage } from './layout/HomePage';

export { default as Settings } from './user/settings';

// Esportazioni per cartelle specifiche (per import più granulari)
export * from './auth';
export * from './quiz';
export * from './friendship';
export * from './layout';
export * from './user';
