import { useEffect, useState } from "react";
import {
  getUserProfile,
  getSpecificUserProfile,
} from "../services/UserService";
import { getAuthToken } from "../services/CommonService";
import { useNavigate } from "react-router-dom";
import "../styles/settings.css";

const ProfilePage = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getInitials = (email) => {
    if (!email) return "?";
    const name = email.split("@")[0];
    const parts = name
      .replace(/[^a-zA-Z0-9]/g, " ")
      .trim()
      .split(" ");
    const initials =
      (parts[0]?.[0] || "").toUpperCase() + (parts[1]?.[0] || "").toUpperCase();
    return initials || name.slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = userId
          ? await getSpecificUserProfile(getAuthToken(), userId)
          : await getUserProfile(getAuthToken());
        setProfile(data);
        setError(null);
      } catch (err) {
        setError("Errore nel recupero del profilo.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Caricamento profilo...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <div className="error-title">{error}</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="empty-state">
        <div className="empty-icon">👤</div>
        <div className="empty-title">Nessun profilo trovato</div>
        <div className="empty-message">
          Il profilo richiesto non esiste o non può essere visualizzato.
        </div>
      </div>
    );
  }

  return (
    <div className="user-settings-container">
      <div className="settings-content">
        {/* User Profile Card */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <span className="avatar-text">{getInitials(profile.email)}</span>
            </div>
            <div className="profile-info">
              <h2 className="profile-title">
                {userId ? `Profilo di ${profile.email}` : "Il tuo profilo"}
              </h2>
              <p className="profile-subtitle">Informazioni dell' account</p>
            </div>
          </div>

          <div className="profile-content">
            {/* Email Section */}
            <div className="setting-item">
              <label className="setting-label">Indirizzo Email</label>
              <div className="setting-value">
                <div className="setting-display">
                  <span className="setting-icon">📧</span>
                  <span className="setting-text">{profile.email}</span>
                </div>
              </div>
            </div>

            <div className="actions-card">
              <h2 className="actions-title">Azioni Profilo</h2>
              <div className="actions-grid">
                <button
                  className="btn btn-action btn-primary"
                  onClick={() => navigate(`/quizzes/${profile.userId}`)}
                >
                  Vedi Quiz
                </button>
                <button
                  className={`btn btn-action ${
                    profile.friendStatus ? "btn-outline" : "btn-primary"
                  }`}
                >
                  {profile.friendStatus
                    ? "Rimuovi Amicizia"
                    : "Aggiungi Amicizia"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
