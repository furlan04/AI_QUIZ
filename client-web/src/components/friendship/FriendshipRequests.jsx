// src/components/FriendshipRequests.jsx
import { useState, useEffect } from "react";
import { 
  getFriendshipRequests, 
  sendFriendshipRequest, 
  acceptFriendshipRequest 
} from "../../services/FriendshipService";
import { getAuthToken } from "../../services/CommonService";

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
      const token = getAuthToken();
      const data = await getFriendshipRequests(token);
      setRequests(data);
    } catch (error) {
      console.error(error);
      setMessage("Errore nel caricamento delle richieste");
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
      const token = getAuthToken();
      await sendFriendshipRequest(email, token);
      setMessage("Richiesta di amicizia inviata con successo!");
      setMessageType("success");
      setEmail("");
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Errore nell'invio della richiesta");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Accetta richiesta di amicizia
  const acceptRequest = async (friendshipId) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      await acceptFriendshipRequest(friendshipId, token);
      setMessage("Richiesta di amicizia accettata!");
      setMessageType("success");
      // Ricarica le richieste per aggiornare la lista
      fetchRequests();
    } catch (error) {
      console.error(error);
      setMessage("Errore nell'accettare la richiesta");
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
    <div className="container my-5">
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3">
              <h4 className="mb-0 fw-bold text-dark">➕ Invia Richiesta</h4>
            </div>
            <div className="card-body">
              <form onSubmit={sendRequest}>
                <div className="mb-3">
                  <label className="form-label">Email dell'utente</label>
                  <div className="input-group">
                    <span className="input-group-text">@</span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="es. nome@dominio.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="form-text">Inserisci l'email della persona a cui vuoi inviare la richiesta.</div>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Invio..." : "Invia Richiesta"}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
              <h4 className="mb-0 fw-bold text-dark">📥 Richieste in Arrivo</h4>
              <button 
                onClick={fetchRequests}
                className="btn btn-outline-secondary btn-sm"
                disabled={loading}
              >
                {loading ? "Caricamento..." : "↻ Aggiorna"}
              </button>
            </div>
            <div className="card-body">
              {loading && requests.length === 0 ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem'}}>
                    <span className="visually-hidden">Caricamento...</span>
                  </div>
                </div>
              ) : requests.length === 0 ? (
                <p className="text-muted text-center">Nessuna richiesta di amicizia in arrivo</p>
              ) : (
                <div className="row g-3">
                  {requests.map((request) => (
                    <div key={request.id} className="col-12">
                      <div className="card border-0 border-start border-4 border-info">
                        <div className="card-body d-flex align-items-center justify-content-between p-3">
                          <div className="d-flex align-items-center">
                            <div className="avatar-circle bg-info bg-opacity-10 text-info me-3">
                              {(request.email || '?').slice(0,2).toUpperCase()}
                            </div>
                            <div>
                              <div className="fw-bold text-dark">{request.email}</div>
                              {request.sentAt && (
                                <small className="text-muted">Inviata il {new Date(request.sentAt).toLocaleDateString('it-IT')}</small>
                              )}
                            </div>
                          </div>
                          <div className="d-flex gap-2">
                            <button
                              onClick={() => acceptRequest(request.id)}
                              className="btn btn-success btn-sm"
                              disabled={loading}
                            >
                              ✔️ Accetta
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
      </div>

      {/* Messaggi di feedback */}
      {message && (
        <div className={`alert mt-4 ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}
    </div>
  );
}