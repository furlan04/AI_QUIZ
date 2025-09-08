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
  const [messageType, setMessageType] = useState("");

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

  const acceptRequest = async (friendshipId) => {
    setLoading(true);
    try {
      const token = getAuthToken();
      await acceptFriendshipRequest(friendshipId, token);
      setMessage("Richiesta di amicizia accettata!");
      setMessageType("success");
      fetchRequests();
    } catch (error) {
      console.error(error);
      setMessage("Errore nell'accettare la richiesta");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

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
    <div className="friendship-requests-container">
      <div className="friendship-header">
        <h1 className="page-title">Gestisci Richieste di Amicizia</h1>
        <p className="page-subtitle">Invia e gestisci le richieste di amicizia</p>
      </div>

      <div className="friendship-grid">
        {/* Send Request Card */}
        <div className="friendship-card send-request-card">
          <div className="card-header">
            <div className="header-icon">➕</div>
            <h2 className="card-title">Invia Richiesta</h2>
            <p className="card-subtitle">Aggiungi un nuovo amico alla tua rete</p>
          </div>
          
          <div className="card-content">
            <form onSubmit={sendRequest} className="request-form">
              <div className="form-group">
                <label className="form-label">Email dell'utente</label>
                <div className="input-container">
                  <div className="input-icon">📧</div>
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
                <div className="form-hint">
                  💡 Inserisci l'email della persona a cui vuoi inviare la richiesta
                </div>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary btn-send-request"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    Invio in corso...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🚀</span>
                    Invia Richiesta
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Incoming Requests Card */}
        <div className="friendship-card incoming-requests-card">
          <div className="card-header">
            <div className="header-content">
              <div className="header-icon">📥</div>
              <div className="header-text">
                <h2 className="card-title">Richieste in Arrivo</h2>
                <p className="card-subtitle">
                  {requests.length} richiesta{requests.length !== 1 ? 'e' : ''} in attesa
                </p>
              </div>
            </div>
            <button 
              onClick={fetchRequests}
              className="btn btn-outline btn-refresh"
              disabled={loading}
            >
              <span className="btn-icon">🔄</span>
              Aggiorna
            </button>
          </div>
          
          <div className="card-content">
            {loading && requests.length === 0 ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p className="loading-text">Caricamento richieste...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3 className="empty-title">Nessuna richiesta</h3>
                <p className="empty-message">
                  Non hai richieste di amicizia in arrivo al momento
                </p>
              </div>
            ) : (
              <div className="requests-list">
                {requests.map((request) => (
                  <div key={request.id} className="request-item">
                    <div className="request-avatar">
                      <span className="avatar-text">
                        {(request.email || '?').slice(0,2).toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="request-info">
                      <h4 className="request-email">{request.email}</h4>
                      {request.sentAt && (
                        <p className="request-date">
                          Inviata il {new Date(request.sentAt).toLocaleDateString('it-IT')}
                        </p>
                      )}
                    </div>
                    
                    <div className="request-actions">
                      <button
                        onClick={() => acceptRequest(request.id)}
                        className="btn btn-success btn-accept"
                        disabled={loading}
                      >
                        <span className="btn-icon">✅</span>
                        Accetta
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Messages */}
      {message && (
        <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-error'}`}>
          <div className="alert-content">
            <span className="alert-icon">
              {messageType === 'success' ? '✅' : '❌'}
            </span>
            <span className="alert-text">{message}</span>
          </div>
        </div>
      )}
    </div>
  );
}