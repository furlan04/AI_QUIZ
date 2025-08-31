// src/components/FriendshipRequests.jsx
import { useState, useEffect } from "react";

export default function FriendshipRequests() {
  const [email, setEmail] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success, error

  // Recupera le richieste di amicizia in arrivo
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(process.env.REACT_APP_ENDPOINT + "/Friendship/requests", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      } else {
        setMessage("Errore nel caricamento delle richieste");
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("Errore di connessione al server");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Invia richiesta di amicizia
  const sendRequest = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(process.env.REACT_APP_ENDPOINT + `/Friendship/send-request/${email}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        setMessage("Richiesta di amicizia inviata con successo!");
        setMessageType("success");
        setEmail("");
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Errore nell'invio della richiesta");
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("Errore di connessione al server");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Accetta richiesta di amicizia
  const acceptRequest = async (friendshipId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(process.env.REACT_APP_ENDPOINT + `/Friendship/accept-request/${friendshipId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        setMessage("Richiesta di amicizia accettata!");
        setMessageType("success");
        // Ricarica le richieste per aggiornare la lista
        fetchRequests();
      } else {
        setMessage("Errore nell'accettare la richiesta");
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("Errore di connessione al server");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Carica le richieste al montaggio del componente
  useEffect(() => {
    fetchRequests();
  }, []);

  // Pulisce il messaggio dopo 3 secondi
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestione Amicizie</h2>

      {/* Sezione per inviare richieste */}
      <div className="card mb-4">
        <div className="card-header">
          <h4>Invia Richiesta di Amicizia</h4>
        </div>
        <div className="card-body">
          <form onSubmit={sendRequest}>
            <div className="mb-3">
              <label className="form-label">Email dell'utente</label>
              <input
                type="email"
                className="form-control"
                placeholder="Inserisci l'email dell'utente"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Invio..." : "Invia Richiesta"}
            </button>
          </form>
        </div>
      </div>

      {/* Messaggi di feedback */}
      {message && (
        <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      {/* Sezione richieste in arrivo */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h4>Richieste di Amicizia in Arrivo</h4>
          <button 
            onClick={fetchRequests}
            className="btn btn-outline-secondary btn-sm"
            disabled={loading}
          >
            {loading ? "Caricamento..." : "Aggiorna"}
          </button>
        </div>
        <div className="card-body">
          {loading && requests.length === 0 ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Caricamento...</span>
              </div>
            </div>
          ) : requests.length === 0 ? (
            <p className="text-muted text-center">Nessuna richiesta di amicizia in arrivo</p>
          ) : (
            <div className="row">
              {requests.map((request) => (
                <div key={request.id} className="col-md-6 col-lg-4 mb-3">
                  <div className="card border-info">
                    <div className="card-body">
                      <h6 className="card-title">{request.email}</h6>
                      <div className="mt-2">
                        <button
                          onClick={() => acceptRequest(request.id)}
                          className="btn btn-success btn-sm"
                          disabled={loading}
                        >
                          Accetta
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}