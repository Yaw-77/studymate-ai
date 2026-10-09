import api from './api';

export const aiAPI = {
  // AI Tutor
  tutorChat: (data) => api.post('/api/tutor/chat', data),
  getConversations: () => api.get('/api/tutor/conversations'),
  getConversation: (id) => api.get(`/api/tutor/conversations/${id}`),
  deleteConversation: (id) => api.delete(`/api/tutor/conversations/${id}`),

  // Note Summarizer
  summarizeNotes: (data) => api.post('/api/summarizer', data),
  getSummaries: () => api.get('/api/summarizer/history'),

  // Quiz
  generateQuiz: (data) => api.post('/api/quiz/generate', data),
  submitQuiz: (quizId, data) => api.post(`/api/quiz/${quizId}/submit`, data),
  getQuizHistory: () => api.get('/api/quiz/history'),

  // Flashcards
  generateFlashcards: (data) => api.post('/api/flashcards/generate', data),
  getFlashcardSets: () => api.get('/api/flashcards'),
  getFlashcardSet: (id) => api.get(`/api/flashcards/${id}`),

  // Dashboard
  getDashboard: () => api.get('/api/dashboard'),

  // History
  getHistory: (type) => api.get('/api/history', { params: { type } }),
};