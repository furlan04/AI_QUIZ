import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getFriendsList, removeFriendship } from "../../services/FriendshipService";
import { getAuthToken } from "../../services/CommonService";

export default function FriendsList() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const data = await getFriendsList(token);
      setFriends(data);
    } catch (error) {
      console.error(error);
      setMessage("Errore nel caricamento della lista amici");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const removeFriend = async (friendshipId) => {
    if (!window.confirm("Sei sicuro di voler rimuovere questa amicizia?")) {
      return;
    }

    setLoading(true);
    try {
      const token = getAuthToken();
      await removeFriendship(friendshipId, token);
      setMessage("Amicizia rimossa con successo");
      setMessageType("success");
      fetchFriends();
    } catch (error) {
      console.error(error);
      setMessage("Errore nella rimozione dell'amicizia");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (email) => {
    if (!email) return "?";
    const name = email.split('@')[0];
    const parts = name.replace(/[^a-zA-Z0-9]/g, ' ').trim().split(' ');
    const initials = (parts[0]?.[0] || '').toUpperCase() + (parts[1]?.[0] || '').toUpperCase();
    return initials || name.slice(0,2).toUpperCase();
  };

  useEffect(() => {
    fetchFriends();
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
    <div className="friends-list-container">
      <div className="friends-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">I Miei Amici</h1>
            <p className="page-subtitle">
              Gestisci le tue connessioni e scopri i quiz dei tuoi amici
            </p>
          </div>
          <button 
            onClick={fetchFriends}
            className="btn btn-outline btn-refresh"
            disabled={loading}
          >
            <span className="btn-icon">🔄</span>
            Aggiorna
          </button>
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

      {/* Friends List */}
      {loading && friends.length === 0 ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="loading-text">Caricamento amici...</p>
        </div>
      ) : friends.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👋</div>
          <h2 className="empty-title">Nessun amico ancora</h2>
          <p className="empty-message">
            Non hai ancora nessun amico nella tua lista.
            Inizia inviando qualche richiesta di amicizia!
          </p>
          <a href="/friendship/requests" className="btn btn-primary btn-empty">
            <span className="btn-icon">➕</span>
            Gestisci Richieste
          </a>
        </div>
      ) : (
        <>
          <div className="friends-stats">
            <span className="stats-text">
              {friends.length} {friends.length === 1 ? 'amico' : 'amici'} trovati
            </span>
          </div>
          
          <div className="friends-grid">
            {friends.map((friend) => (
              <div key={friend.friendshipId || friend.id} className="friend-card">
                <div className="friend-header">
                  <div className="friend-avatar">
                    <span className="avatar-text">
                      {getInitials(friend.friendEmail)}
                    </span>
                  </div>
                  <div className="friend-status">
                    <span className="status-dot"></span>
                    <span className="status-text">Online</span>
                  </div>
                </div>
                
                <div className="friend-content">
                  <h3 className="friend-email">{friend.friendEmail}</h3>
                  {friend.since && (
                    <p className="friend-since">
                      Amici dal {new Date(friend.since).toLocaleDateString('it-IT')}
                    </p>
                  )}
                </div>
                
                <div className="friend-actions">
                  <button
                    onClick={() => navigate(`/quizzes/${friend.friendId}`)}
                    className="btn btn-primary btn-view-quizzes"
                    disabled={loading}
                  >
                    <span className="btn-icon">📚</span>
                    Vedi Quiz
                  </button>
                  <button
                    onClick={() => removeFriend(friend.friendshipId || friend.id)}
                    className="btn btn-outline btn-remove"
                    disabled={loading}
                  >
                    <span className="btn-icon">🗑️</span>
                    Rimuovi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}