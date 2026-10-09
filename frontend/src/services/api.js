import axios from 'axios';

// Default to same-origin so the Vite dev proxy (dev) and the nginx /api
// proxy (Docker) both work without any extra configuration. Set
// VITE_API_BASE_URL only when the API lives on a different host.
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor: attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('studymate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('studymate_token');
      localStorage.removeItem('studymate_user');
      // Don't redirect here - let the ProtectedRoute component handle navigation
      // This avoids full page reloads and preserves React state
    }
    return Promise.reject(error);
  }
);

export default api;

export const getErrorMessage = (error) => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred.';
};