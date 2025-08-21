import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Benvenuto su QuizApp!</h1>
      <p className="lead">
        Crea i tuoi quiz o gioca a quelli degli altri utenti.
      </p>
      <div className="mt-4">
        <Link to="/login" className="btn btn-primary me-2">
          Accedi
        </Link>
        <Link to="/register" className="btn btn-success">
          Registrati
        </Link>
      </div>
    </div>
  );
}
