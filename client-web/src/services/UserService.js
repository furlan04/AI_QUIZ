// src/services/UserService.js;
import {
  handleHttpError,
  handleNetworkError,
  createAuthHeaders,
} from "./CommonService";
import { getConfig } from "../config/config";

const API_URL = getConfig("API_ENDPOINT");

export const getUserProfile = async (token) => {
  try {
    const response = await fetch(`${API_URL}/User/Profile`, {
      method: "GET",
      headers: createAuthHeaders(token),
    });
    handleHttpError(response);
    return await response.json();
  } catch (error) {
    return handleNetworkError(error);
  }
};

export const getSpecificUserProfile = async (token, userId) => {
  try {
    const response = await fetch(`${API_URL}/User/Profile?userId=${userId}`, {
      method: "GET",
      headers: createAuthHeaders(token),
    });
    handleHttpError(response);
    return await response.json();
  } catch (error) {
    return handleNetworkError(error);
  }
};

export const getUserFeed = async (token) => {
  try {
    const response = await fetch(`${API_URL}/User/Feed`, {
      method: "GET",
      headers: createAuthHeaders(token),
    });
    handleHttpError(response);
    return await response.json();
  } catch (error) {
    return handleNetworkError(error);
  }
};
