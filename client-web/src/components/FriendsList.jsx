// src/components/FriendsList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


export default function FriendsList() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  // Recupera la lista degli amici
  const fetchFriends = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(process.env.REACT_APP_ENDPOINT + "/Friendship/friend-list", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFriends(data);
      } else {
        setMessage("Errore nel caricamento della lista amici");
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

  // Rimuovi amicizia
  const removeFriend = async (friendshipId) => {
    if (!window.confirm("Sei sicuro di voler rimuovere questa amicizia?")) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(process.env.REACT_APP_ENDPOINT + `/Friendship/remove-friendship/${friendshipId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        setMessage("Amicizia rimossa con successo");
        setMessageType("success");
        // Ricarica la lista degli amici
        fetchFriends();
      } else {
        setMessage("Errore nella rimozione dell'amicizia");
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

  // Helpers
  const getInitials = (email) => {
    if (!email) return "?";
    const name = email.split('@')[0];
    const parts = name.replace(/[^a-zA-Z0-9]/g, ' ').trim().split(' ');
    const initials = (parts[0]?.[0] || '').toUpperCase() + (parts[1]?.[0] || '').toUpperCase();
    return initials || name.slice(0,2).toUpperCase();
  };

  // Carica gli amici al montaggio del componente
  useEffect(() => {
    fetchFriends();
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
    <div className="container my-5">
      <div className="row align-items-center mb-4">
        <div className="col">
          <h2 className="fw-bold text-primary mb-0">I Miei Amici</h2>
          <small className="text-muted">Gestisci le tue connessioni e scopri i quiz dei tuoi amici</small>
        </div>
        <div className="col-auto">
          <button 
            onClick={fetchFriends}
            className="btn btn-outline-primary"
            disabled={loading}
          >
            {loading ? "Caricamento..." : "↻ Aggiorna"}
          </button>
        </div>
      </div>

      {/* Messaggi di feedback */}
      {message && (
        <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      {/* Lista degli amici */}
      {loading && friends.length === 0 ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Caricamento...</span>
          </div>
        </div>
      ) : friends.length === 0 ? (
        <div className="text-center">
          <div className="card border-0 shadow-sm">
            <div className="card-body py-5">
              <div className="display-6 mb-3">👋</div>
              <h5 className="card-title text-muted">Nessun amico ancora</h5>
              <p className="card-text mb-4">
                Non hai ancora nessun amico nella tua lista.
                Inizia inviando qualche richiesta di amicizia!
              </p>
              <a href="/friendship/requests" className="btn btn-primary">
                ➕ Gestisci Richieste
              </a>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-3">
            <small className="text-muted">
              {friends.length} {friends.length === 1 ? 'amico' : 'amici'} trovati
            </small>
          </div>
          <div className="row g-4">
            {friends.map((friend) => (
              <div key={friend.friendshipId || friend.id} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body d-flex flex-column p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar-circle bg-primary bg-opacity-10 text-primary me-3">
                        {getInitials(friend.friendEmail)}
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{friend.friendEmail}</div>
                        {friend.since && (
                          <small className="text-muted">Amici dal {new Date(friend.since).toLocaleDateString('it-IT')}</small>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-auto d-flex gap-2">
                      <button
                        onClick={() => navigate(`/quizzes/${friend.friendId}`)}
                        className="btn btn-outline-primary btn-sm flex-grow-1"
                        disabled={loading}
                      >
                        📚 Vedi Quiz
                      </button>
                      <button
                        onClick={() => removeFriend(friend.friendshipId || friend.id)}
                        className="btn btn-outline-danger btn-sm"
                        disabled={loading}
                      >
                        🗑️ Rimuovi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}