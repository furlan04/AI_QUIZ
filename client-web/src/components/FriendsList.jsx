// src/components/FriendsList.jsx
import { useState, useEffect } from "react";

export default function FriendsList() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

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
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>I Miei Amici</h2>
        <button 
          onClick={fetchFriends}
          className="btn btn-outline-primary"
          disabled={loading}
        >
          {loading ? "Caricamento..." : "Aggiorna Lista"}
        </button>
      </div>

      {/* Messaggi di feedback */}
      {message && (
        <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      {/* Lista degli amici */}
      {loading && friends.length === 0 ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
        </div>
      ) : friends.length === 0 ? (
        <div className="text-center">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-muted">Nessun amico ancora</h5>
              <p className="card-text">
                Non hai ancora nessun amico nella tua lista. 
                Inizia inviando qualche richiesta di amicizia!
              </p>
              <a href="/friendship/requests" className="btn btn-primary">
                Gestisci Richieste
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
          <div className="row">
            {friends.map((friend) => (
              <div key={friend.friendshipId || friend.id} className="col-md-6 col-lg-4 mb-3">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <div className="mb-2">
                      <h6 className="card-title mb-1">
                        {friend.friendName || friend.name}
                      </h6>
                      <p className="card-text text-muted mb-1">
                        {friend.friendEmail || friend.email}
                      </p>
                      {friend.friendsSince && (
                        <small className="text-muted">
                          Amici dal: {new Date(friend.friendsSince).toLocaleDateString()}
                        </small>
                      )}
                    </div>
                    
                    <div className="mt-auto">
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => removeFriend(friend.friendshipId || friend.id)}
                          className="btn btn-outline-danger btn-sm"
                          disabled={loading}
                        >
                          Rimuovi Amicizia
                        </button>
                        {/* Opzionale: Pulsante per vedere i quiz dell'amico */}
                        <button 
                          className="btn btn-outline-primary btn-sm"
                          disabled
                          title="Funzionalità non ancora implementata"
                        >
                          Vedi Quiz
                        </button>
                      </div>
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