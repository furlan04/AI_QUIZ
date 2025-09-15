import React, { useState, useEffect } from "react";
import { isLiked, likePost, unlikePost } from "../services/LikeService"; // Assumendo che il file si chiami LikeService.js
import { FaHeart } from "react-icons/fa"; // Libreria per icone, installa con `npm install react-icons`
import { getAuthToken } from "../services";

const LikeButton = ({ postId }) => {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikedStatus = async () => {
        const token = getAuthToken();
      setLoading(true);
      const result = await isLiked(postId, token);
      if (result.success) {
        setLiked(result.liked);
      } else {
        setError(result.message);
      }
      setLoading(false);
    };
    fetchLikedStatus();
  }, [postId]);

  const handleLikeToggle = async () => {
    const token = getAuthToken();
    setLoading(true);
    let result;
    if (liked) {
      result = await unlikePost(postId, token);
    } else {
      result = await likePost(postId, token);
    }

    if (result.success) {
      setLiked(!liked);
      setError(null);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <button
        onClick={handleLikeToggle}
        disabled={loading}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          outline: "none",
        }}
      >
        <FaHeart color={liked ? "red" : "gray"} size={24} />
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default LikeButton;
