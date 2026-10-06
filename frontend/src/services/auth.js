import api from './api';

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),
  me: () => api.get('/api/auth/me'),
};

export const setToken = (token) => localStorage.setItem('studymate_token', token);
export const getToken = () => localStorage.getItem('studymate_token');
export const removeToken = () => localStorage.removeItem('studymate_token');

export const setUser = (user) => localStorage.setItem('studymate_user', JSON.stringify(user));
export const getUser = () => {
  const user = localStorage.getItem('studymate_user');
  return user ? JSON.parse(user) : null;
};
export const removeUser = () => localStorage.removeItem('studymate_user');