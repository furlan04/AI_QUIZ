import { useEffect, useState } from "react";
import {
  getUserProfile,
  getSpecificUserProfile,
} from "../services/UserService";
import {
  sendFriendshipRequest,
  removeFriendship,
} from "../services/FriendshipService";
import { useParams } from "react-router-dom";

import { getAuthToken } from "../services/CommonService";
import { useNavigate } from "react-router-dom";
import "../styles/settings.css";
import { motion, AnimatePresence } from "framer-motion";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { userId } = useParams();

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
                <label className="setting-label">Numero amici</label>
                <div className="setting-display">
                  <span className="setting-icon">👥</span>
                  <span className="setting-text">{profile.friendsCount}</span>
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
                {!profile.isCurrentUser && !profile.haveSentRequest && (
                  <AnimatePresence mode="wait">
                    <motion.button
                      key={profile.isFriend ? "remove" : "add"} // cambia la key per forzare transizione
                      className={`btn btn-action ${
                        profile.friendStatus ? "btn-outline" : "btn-primary"
                      }`}
                      onClick={async () => {
                        try {
                          if (profile.isFriend) {
                            await removeFriendship(
                              profile.friendshipId,
                              getAuthToken()
                            );
                            setProfile({ ...profile, isFriend: false, haveSentRequest: false });
                          } else {
                            await sendFriendshipRequest(
                              profile.email,
                              getAuthToken()
                            );
                            setProfile({ ...profile, isFriend: true, haveSentRequest: true});
                          }
                        } catch (err) {
                          console.error(
                            "Errore nell'aggiornamento dello stato di amicizia",
                            err
                          );
                        }
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      {profile.isFriend
                        ? "Rimuovi Amicizia"
                        : "Aggiungi Amicizia"}
                    </motion.button>
                  </AnimatePresence>
                )}
                { profile.haveSentRequest && !profile.isCurrentUser && (
                  <button
                    className="btn btn-action btn-secondary"
                    disabled
                  >
                    Richiesta Inviata 📨
                  </button>
                )}
                { profile.isCurrentUser && (
                  <button
                    className="btn btn-action btn-secondary"
                    onClick={() => navigate("/settings")}
                  >
                    Impostazioni Account 🛠️
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
