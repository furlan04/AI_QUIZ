// src/services/QuizService.js
const API_URL = process.env.REACT_APP_ENDPOINT

export const createQuiz = async (topic, token) => {
  const response = await fetch(`${API_URL}/Quiz/` + topic, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  return await response.json();
};

export const getMyQuizzes = async (token) => {
  const response = await fetch(`${API_URL}/Quiz`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  return await response.json();
};

export const getQuizzes = async (token, userId) => {
  const response = await fetch(`${API_URL}/Quiz?userId=${userId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  return await response.json();
};
