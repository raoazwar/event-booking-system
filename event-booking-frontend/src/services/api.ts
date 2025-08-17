import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
    api.post('/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/login', data),
  logout: () => api.post('/logout'),
};

// Events API
export const eventsAPI = {
  getAll: () => api.get('/events'),
  getById: (id: number) => api.get(`/events/${id}`),
  create: (data: any) => api.post('/events', data),
  update: (id: number, data: any) => api.put(`/events/${id}`, data),
  delete: (id: number) => api.delete(`/events/${id}`),
};

// Bookings API
export const bookingsAPI = {
  create: (data: { event_id: number; ticket_count: number; ticket_type_id?: number }) =>
    api.post('/bookings', data),
  getAll: () => api.get('/bookings'),
  getById: (id: number) => api.get(`/bookings/${id}`),
  cancel: (id: number) => api.delete(`/bookings/${id}`),
  getQRCode: (id: number) => api.get(`/bookings/${id}/qr-code`),
};

// RSVP API
export const rsvpAPI = {
  create: (data: { event_id: number; name: string; email: string; phone: string; guest_count: number; message?: string }) =>
    api.post('/rsvps', data),
  getByEvent: (eventId: number) => api.get(`/events/${eventId}/rsvps`),
  update: (id: number, data: any) => api.put(`/rsvps/${id}`, data),
  delete: (id: number) => api.delete(`/rsvps/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getEventAnalytics: (id: number) => api.get(`/dashboard/events/${id}/analytics`),
  getEventPerformance: () => api.get('/dashboard/analytics/events'),
  getRevenueAnalytics: () => api.get('/dashboard/analytics/revenue'),
  getUserAnalytics: () => api.get('/dashboard/analytics/users'),
  getRealTimeStats: () => api.get('/dashboard/analytics/realtime'),
};

export default api;
